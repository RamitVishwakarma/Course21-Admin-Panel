import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import fireToast from '@/hooks/fireToast';
import {
  CurrencyRupeeIcon,
  IdentificationIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';
import { useState } from 'react';
import { useCourseStore } from '@/store/useCourseStore';

export default function CreateCourse() {
  const addCourse = useCourseStore((state) => state.addCourse);

  interface FormData {
    title: string;
    description: string;
    category: string;
    price: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    language: string;
    thumbnail: string;
  }

  const [data, setData] = useState<FormData>({
    title: '',
    description: '',
    category: 'programming',
    price: 0,
    level: 'beginner',
    language: 'English',
    thumbnail: '',
  });
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Handle form input changes
  const handleFormData = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      handleImageUpload(fileInput.files![0]);
      return;
    }
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Function to handle image upload - now just creates a mock URL
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);

    try {
      // Instead of uploading to Cloudinary, we create a mock URL
      setTimeout(() => {
        const mockImagePath = `courses/${Math.random()
          .toString(36)
          .substring(2)}.png`;
        setData((prev) => ({ ...prev, thumbnail: mockImagePath }));
        fireToast.success('Image Uploaded', 'Image uploaded successfully!');
        setUploading(false);
      }, 1000); // Simulate a delay
    } catch (error) {
      fireToast.error(
        'Upload Failed',
        'Image upload failed. Please try again.',
      );
      setUploading(false);
    }
  };

  // Form submission handler
  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.thumbnail) {
      fireToast.warning(
        'Missing Image',
        'Please upload an image before submitting.',
      );
      return;
    }

    // Create a comprehensive course object that matches the Course interface
    const newCourse = {
      title: data.title,
      description: data.description,
      shortDescription: data.description.substring(0, 100) + '...',
      thumbnail: data.thumbnail,
      category: data.category,
      tags: [data.category, data.level],
      price: Number(data.price),
      currency: 'INR',
      level: data.level,
      language: data.language,
      duration: 0, // Will be calculated when modules are added
      enrollmentCount: 0,
      rating: 0,
      reviewCount: 0,
      isPublished: false,
      isFeatured: false,
      instructorId: 'user-2', // Default to Rahul Gupta (instructor)
      instructorName: 'Rahul Gupta',
      instructorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      modules: [],
      moduleCount: 0,
      lectureCount: 0,
      learningOutcomes: ['Complete understanding of the subject'],
      prerequisites: ['Basic knowledge recommended'],
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      metaDescription: data.description,
      keywords: [data.category, data.level],
      publishedAt: undefined,
      totalEnrollments: 0,
      completionRate: 0,
      averageRating: 0,
      totalRevenue: 0,
    };

    addCourse(newCourse);
    fireToast.courseCreated(data.title);

    // Close the dialog and reset the form
    setOpen(false);
    setData({
      title: '',
      description: '',
      category: 'programming',
      price: 0,
      level: 'beginner',
      language: 'English',
      thumbnail: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="m-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-meta-3 py-4 px-6 text-center font-medium text-white hover:bg-opacity-80 lg:px-6 xl:px-8">
          <PlusCircleIcon className="h-5 w-5" />
          Create New
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto z-[9999]">
        <DialogTitle>Create Course</DialogTitle>
        <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
          <form onSubmit={formSubmitHandler} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course Title */}
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Course Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={handleFormData}
                    placeholder="Enter Course Title"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    required
                  />
                  <span className="absolute right-3 top-3">
                    <IdentificationIcon className="w-5 h-5 text-bodydark" />
                  </span>
                </div>
              </div>

              {/* Course Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Course Description
                </label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleFormData}
                  placeholder="Enter Course Description"
                  rows={3}
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Category
                </label>
                <select
                  name="category"
                  value={data.category}
                  onChange={handleFormData}
                  className="block w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                >
                  <option value="" disabled className="option-padding">
                    Select Category
                  </option>
                  <option value="programming" className="option-padding">
                    Programming
                  </option>
                  <option value="design" className="option-padding">
                    Design
                  </option>
                  <option value="business" className="option-padding">
                    Business
                  </option>
                  <option value="marketing" className="option-padding">
                    Marketing
                  </option>
                  <option value="data-science" className="option-padding">
                    Data Science
                  </option>
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Course Level
                </label>
                <select
                  name="level"
                  value={data.level}
                  onChange={handleFormData}
                  className="block w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                >
                  <option value="" disabled className="option-padding">
                    Select Level
                  </option>
                  <option value="beginner" className="option-padding">
                    Beginner
                  </option>
                  <option value="intermediate" className="option-padding">
                    Intermediate
                  </option>
                  <option value="advanced" className="option-padding">
                    Advanced
                  </option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Language
                </label>
                <select
                  name="language"
                  value={data.language}
                  onChange={handleFormData}
                  className="block w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                >
                  <option value="" disabled className="option-padding">
                    Select Language
                  </option>
                  <option value="English" className="option-padding">
                    English
                  </option>
                  <option value="Hindi" className="option-padding">
                    Hindi
                  </option>
                  <option value="Tamil" className="option-padding">
                    Tamil
                  </option>
                  <option value="Telugu" className="option-padding">
                    Telugu
                  </option>
                  <option value="Bengali" className="option-padding">
                    Bengali
                  </option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Course Price (INR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={data.price}
                    onChange={handleFormData}
                    placeholder="Enter Course Price"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    required
                  />
                  <span className="absolute right-3 top-3">
                    <CurrencyRupeeIcon className="w-5 h-5 text-bodydark" />
                  </span>
                </div>
              </div>

              {/* Photo upload */}
              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-black dark:text-white">
                  Course Thumbnail
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleFormData}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-3 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-2 file:px-3 file:hover:bg-primary file:hover:bg-opacity-10 dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white"
                  accept="image/*"
                  required
                />
                {uploading && (
                  <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                )}
              </div>

              {/* Preview Image */}
              {data.thumbnail && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mt-1">
                    Image path: {data.thumbnail}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <div className="w-full">
                <input
                  type="submit"
                  value={uploading ? 'Uploading...' : 'Submit'}
                  disabled={uploading}
                  className="w-full font-medium cursor-pointer rounded-lg border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                />
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
