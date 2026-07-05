import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../../api/axiosClient';
import { CardSkeleton } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import Drawer from '../../components/Drawer';
import toast from 'react-hot-toast';
import { Building2, Plus, Search, MapPin, DollarSign, Globe, Briefcase, FileText, Loader2 } from 'lucide-react';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      roleOffered: '',
      packageLpa: '',
      location: '',
      jobDescription: '',
      companyWebsite: ''
    }
  });

  const fetchCompanies = async () => {
    try {
      const response = await axiosClient.get('/companies');
      if (response.data?.success) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      // Handled globally
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Registering company...');
    try {
      await axiosClient.post('/companies', {
        ...data,
        packageLpa: parseFloat(data.packageLpa)
      });
      toast.success('Company registered successfully!', { id: toastId });
      setIsFormOpen(false);
      reset();
      fetchCompanies();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to register company.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setIsDrawerOpen(true);
  };

  // Filter companies by search term
  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.roleOffered?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Hiring Partners Directory</h2>
          <p className="text-text-low text-sm">Register corporate companies and view their job profiles metadata.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2.5 text-xs flex items-center gap-2 cursor-pointer transition-colors shrink-0 shadow-lg hover:shadow-blue-500/10"
        >
          <Plus size={16} /> Register Company
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by company name, role or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-850 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-blue/50"
          />
        </div>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <EmptyState 
          title="No Companies Registered"
          description="Click the Register button above to add a hiring partner."
          icon={Building2}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="glass-card rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-violet"></div>
              
              <div>
                <div className="flex gap-3 items-center mb-4">
                  <div className="p-2.5 bg-brand-violet/10 text-brand-violet rounded-lg">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base truncate max-w-[170px]" title={company.name}>
                      {company.name}
                    </h3>
                    <span className="text-[11px] text-brand-cyan font-semibold block uppercase tracking-wide">
                      {company.roleOffered}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-850 pt-3.5 mb-6 text-xs text-text-medium">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-brand-violet" />
                    <span>LPA Offered: <strong>{company.packageLpa.toFixed(2)} LPA</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-brand-blue" />
                    <span>Job Location: <strong>{company.location}</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleViewDetails(company)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/60 text-xs font-semibold rounded-lg py-2 transition-colors cursor-pointer"
              >
                Inspect Corporate Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drawer: Add Company Form */}
      <Drawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Register Hiring Partner"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Company Name</label>
            <input
              type="text"
              placeholder="e.g. NVIDIA"
              {...register('name', { required: 'Company name is required' })}
              className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Role/Profile Offered</label>
            <input
              type="text"
              placeholder="e.g. Systems Engineer"
              {...register('roleOffered', { required: 'Role title is required' })}
              className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
            />
            {errors.roleOffered && <p className="text-red-400 text-xs mt-1">{errors.roleOffered.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Salary Package (LPA)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 32.50"
                {...register('packageLpa', { 
                  required: 'Package is required',
                  min: { value: 0, message: 'Package cannot be negative' }
                })}
                className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.packageLpa && <p className="text-red-400 text-xs mt-1">{errors.packageLpa.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Job Location</label>
              <input
                type="text"
                placeholder="e.g. Pune, Bangalore"
                {...register('location', { required: 'Job location is required' })}
                className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
              {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Website URL</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-low pointer-events-none">
                <Globe size={16} />
              </span>
              <input
                type="url"
                placeholder="https://nvidia.com"
                {...register('companyWebsite', { required: 'Website URL is required' })}
                className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
              />
            </div>
            {errors.companyWebsite && <p className="text-red-400 text-xs mt-1">{errors.companyWebsite.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-medium mb-1.5 uppercase">Job Description</label>
            <textarea
              rows={4}
              placeholder="Low-level software development, C++, multi-threading..."
              {...register('jobDescription', { required: 'Job description is required' })}
              className="w-full bg-slate-900 border border-slate-850 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue/50"
            />
            {errors.jobDescription && <p className="text-red-400 text-xs mt-1">{errors.jobDescription.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wide cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Registering...
              </>
            ) : (
              'Save Company Profile'
            )}
          </button>
        </form>
      </Drawer>

      {/* Drawer: View Details */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Corporate Partner Profile"
      >
        {selectedCompany && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
              <div className="p-3 bg-brand-violet/10 text-brand-violet rounded-xl">
                <Building2 size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white leading-tight">{selectedCompany.name}</h4>
                <a 
                  href={selectedCompany.companyWebsite} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-brand-cyan hover:text-white transition-colors flex items-center gap-1 mt-1 font-semibold"
                >
                  Visit Corporate Site <Globe size={12} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Role Offered</span>
                <span className="text-sm font-semibold text-white">{selectedCompany.roleOffered}</span>
              </div>
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Salary Package</span>
                <span className="text-sm font-bold text-brand-blue">{selectedCompany.packageLpa.toFixed(2)} LPA</span>
              </div>
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Job Location</span>
                <span className="text-sm font-semibold text-white">{selectedCompany.location}</span>
              </div>
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-text-low block mb-1">Registered By</span>
                <span className="text-sm font-semibold text-white truncate" title={selectedCompany.createdByEmail}>
                  {selectedCompany.createdByEmail}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 p-4 bg-slate-900/40 border border-slate-850 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-text-low tracking-wide flex items-center gap-1 text-brand-violet">
                <FileText size={12} /> Full Job Description
              </span>
              <p className="text-text-medium text-xs leading-relaxed whitespace-pre-wrap pt-1.5">
                {selectedCompany.jobDescription}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CompanyManagement;
