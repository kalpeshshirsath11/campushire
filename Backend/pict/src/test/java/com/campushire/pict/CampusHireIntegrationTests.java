package com.campushire.pict;

import com.campushire.pict.student.VerificationStatus;
import com.campushire.pict.user.Role;
import com.campushire.pict.user.User;
import com.campushire.pict.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CampusHireIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String tpoToken;
    private String studentToken;
    private Long companyId;
    private Long driveId;

    @BeforeEach
    public void setup() throws Exception {
        userRepository.deleteAll();

        // 1. Create a TPO user
        User tpo = User.builder()
                .email("tpo@campushire.com")
                .password(passwordEncoder.encode("tpopassword"))
                .role(Role.ROLE_TPO)
                .isActive(true)
                .firstLogin(false)
                .build();
        userRepository.save(tpo);

        // 2. Obtain TPO JWT Token
        String tpoLoginJson = "{\"email\":\"tpo@campushire.com\",\"password\":\"tpopassword\"}";

        MvcResult tpoResult = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(tpoLoginJson))
                .andExpect(status().isOk())
                .andReturn();

        String tpoResponse = tpoResult.getResponse().getContentAsString();
        Map<?, ?> tpoMap = objectMapper.readValue(tpoResponse, Map.class);
        Map<?, ?> tpoData = (Map<?, ?>) tpoMap.get("data");
        tpoToken = (String) tpoData.get("token");
    }

    @Test
    public void testFullPlacementWorkflow() throws Exception {
        // --- 1. BULK UPLOAD STUDENTS (TPO) ---
        String csvContent = "prn,email,password\n" +
                "PRN101,student1@campushire.com,studentpass\n" +
                "PRN102,student2@campushire.com,studentpass\n";
                
        MockMultipartFile csvFile = new MockMultipartFile(
                "file",
                "students.csv",
                MediaType.TEXT_PLAIN_VALUE,
                csvContent.getBytes()
        );

        mockMvc.perform(multipart("/api/v1/students/bulk-upload")
                .file(csvFile)
                .header("Authorization", "Bearer " + tpoToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.successCount").value(2))
                .andExpect(jsonPath("$.data.failureCount").value(0));

        // --- 2. LOGIN AS STUDENT (first_login should be true) ---
        String studentLoginJson = "{\"email\":\"student1@campushire.com\",\"password\":\"studentpass\"}";

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentLoginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.firstLogin").value(true))
                .andReturn();

        String studentResponse = loginResult.getResponse().getContentAsString();
        Map<?, ?> studentMap = objectMapper.readValue(studentResponse, Map.class);
        Map<?, ?> studentData = (Map<?, ?>) studentMap.get("data");
        studentToken = (String) studentData.get("token");

        // --- 3. FORCE PASSWORD CHANGE ON FIRST LOGIN ---
        // Accessing profile me before password change should return 403
        mockMvc.perform(get("/api/v1/students/profile/me")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Password change required on first login"));

        // Call change password
        String changeRequestJson = "{\"oldPassword\":\"studentpass\",\"newPassword\":\"newstudentpass\"}";

        mockMvc.perform(post("/api/v1/auth/change-password")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(changeRequestJson))
                .andExpect(status().isOk());

        // Re-authenticate student with new password
        String studentReLoginJson = "{\"email\":\"student1@campushire.com\",\"password\":\"newstudentpass\"}";
        MvcResult reLoginResult = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(studentReLoginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.firstLogin").value(false))
                .andReturn();

        String reStudentResponse = reLoginResult.getResponse().getContentAsString();
        Map<?, ?> reStudentMap = objectMapper.readValue(reStudentResponse, Map.class);
        Map<?, ?> reStudentData = (Map<?, ?>) reStudentMap.get("data");
        studentToken = (String) reStudentData.get("token");

        // Now fetching profile me should work
        mockMvc.perform(get("/api/v1/students/profile/me")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.profileCompleted").value(false));

        // --- 4. STUDENT COMPLETES PROFILE ---
        String profileRequestJson = "{" +
                "\"fullName\":\"John Doe\"," +
                "\"branch\":\"CS\"," +
                "\"cgpa\":9.2," +
                "\"tenthPercentage\":91.0," +
                "\"twelfthPercentage\":88.5," +
                "\"backlogs\":0," +
                "\"phone\":\"9876543210\"," +
                "\"personalEmail\":\"john.doe@gmail.com\"," +
                "\"address\":\"Pune, India\"," +
                "\"resumeLink\":\"http://drive.google.com/resume\"," +
                "\"resumeFileName\":\"resume.pdf\"," +
                "\"tenthMarksheetLink\":\"http://drive.google.com/10th\"," +
                "\"tenthMarksheetFileName\":\"10th.pdf\"," +
                "\"twelfthMarksheetLink\":\"http://drive.google.com/12th\"," +
                "\"twelfthMarksheetFileName\":\"12th.pdf\"," +
                "\"degreeResultLink\":\"http://drive.google.com/degree\"," +
                "\"degreeResultFileName\":\"degree.pdf\"," +
                "\"aadhaarLink\":\"http://drive.google.com/aadhaar\"," +
                "\"aadhaarFileName\":\"aadhaar.pdf\"," +
                "\"photoLink\":\"http://drive.google.com/photo\"," +
                "\"photoFileName\":\"photo.jpg\"" +
                "}";

        mockMvc.perform(put("/api/v1/students/profile")
                .header("Authorization", "Bearer " + studentToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(profileRequestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.profileCompleted").value(true))
                .andExpect(jsonPath("$.data.verificationStatus").value("PENDING"));

        // Get student ID from me profile
        MvcResult profileMeResult = mockMvc.perform(get("/api/v1/students/profile/me")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andReturn();

        String profileMeResponse = profileMeResult.getResponse().getContentAsString();
        Map<?, ?> profileMeMap = objectMapper.readValue(profileMeResponse, Map.class);
        Map<?, ?> profileMeData = (Map<?, ?>) profileMeMap.get("data");
        Integer studentIdInt = (Integer) profileMeData.get("id");
        Long studentId = studentIdInt.longValue();

        // --- 5. TPO VERIFIES STUDENT PROFILE ---
        String verifyRequestJson = "{\"status\":\"VERIFIED\",\"remarks\":\"Documents look correct\"}";

        mockMvc.perform(put("/api/v1/students/" + studentId + "/verify")
                .header("Authorization", "Bearer " + tpoToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(verifyRequestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.verificationStatus").value("VERIFIED"));

        // --- 6. TPO CREATES COMPANY ---
        String companyRequestJson = "{" +
                "\"name\":\"Google\"," +
                "\"roleOffered\":\"Software Engineer\"," +
                "\"packageLpa\":35.5," +
                "\"location\":\"Bangalore\"," +
                "\"jobDescription\":\"Full-stack Java Developer\"," +
                "\"companyWebsite\":\"https://google.com\"" +
                "}";

        MvcResult companyResult = mockMvc.perform(post("/api/v1/companies")
                .header("Authorization", "Bearer " + tpoToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(companyRequestJson))
                .andExpect(status().isOk())
                .andReturn();

        String companyResponseStr = companyResult.getResponse().getContentAsString();
        Map<?, ?> companyMap = objectMapper.readValue(companyResponseStr, Map.class);
        Map<?, ?> companyData = (Map<?, ?>) companyMap.get("data");
        companyId = ((Integer) companyData.get("id")).longValue();

        // --- 7. TPO CREATES RECRUITMENT DRIVE ---
        String deadlineStr = LocalDateTime.now().plusDays(2).toString();
        String driveRequestJson = "{" +
                "\"companyId\":" + companyId + "," +
                "\"title\":\"Google SWE Drive 2026\"," +
                "\"description\":\"Off-campus drive for Java Developers\"," +
                "\"deadline\":\"" + deadlineStr + "\"," +
                "\"minimumCgpa\":8.5," +
                "\"allowedBacklogs\":0," +
                "\"minimumTenthPercentage\":85.0," +
                "\"minimumTwelfthPercentage\":85.0," +
                "\"eligibleBranches\":[\"CS\"]," +
                "\"bondDetails\":\"No bond\"," +
                "\"driveDate\":\"" + LocalDate.now().plusDays(10) + "\"" +
                "}";

        MvcResult driveResult = mockMvc.perform(post("/api/v1/drives")
                .header("Authorization", "Bearer " + tpoToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(driveRequestJson))
                .andExpect(status().isOk())
                .andReturn();

        String driveResponseStr = driveResult.getResponse().getContentAsString();
        Map<?, ?> driveMap = objectMapper.readValue(driveResponseStr, Map.class);
        Map<?, ?> driveData = (Map<?, ?>) driveMap.get("data");
        driveId = ((Integer) driveData.get("id")).longValue();

        // --- 8. STUDENT VIEWS ELIGIBLE DRIVES ---
        mockMvc.perform(get("/api/v1/drives/eligible")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].title").value("Google SWE Drive 2026"));

        // --- 9. STUDENT APPLIES TO DRIVE ---
        MvcResult appResult = mockMvc.perform(post("/api/v1/drives/" + driveId + "/apply")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("APPLIED"))
                .andReturn();

        String appResponseStr = appResult.getResponse().getContentAsString();
        Map<?, ?> appMap = objectMapper.readValue(appResponseStr, Map.class);
        Map<?, ?> appData = (Map<?, ?>) appMap.get("data");
        Long applicationId = ((Integer) appData.get("id")).longValue();

        // --- 10. TPO UPDATES APPLICATION STATUS ---
        String statusRequestJson = "{\"status\":\"HR\",\"remarks\":\"Cleared Technical rounds\"}";

        mockMvc.perform(put("/api/v1/applications/" + applicationId + "/status")
                .header("Authorization", "Bearer " + tpoToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(statusRequestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("HR"))
                .andExpect(jsonPath("$.data.remarks").value("Cleared Technical rounds"));
    }
}
