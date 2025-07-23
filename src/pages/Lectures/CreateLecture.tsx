import React, { useState } from 'react';
import { IdentificationIcon, PlusCircleIcon } from '@heroicons/react/20/solid';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useLectureStore } from '@/store/useLectureStore';
import { useModuleStore } from '@/store/useModuleStore';

export default function CreateLecture({
  moduleId,
  refreshPage,
}: {
  moduleId: string;
  refreshPage: () => void;
}) {
  interface FormData {
    title: string;
    description: string;
    moduleId: string;
    videoDuration: number;
    type: 'video' | 'text' | 'quiz' | 'assignment';
    videoUrl: string;
    content?: string;
    isFree: boolean;
  }

  const [data, setData] = useState<FormData>({
    title: '',
    description: '',
    moduleId: moduleId,
    videoDuration: 0,
    type: 'video',
    videoUrl: '',
    content: '',
    isFree: false,
  });

  const { toast } = useToast();

  // Get stores
  const addLecture = useLectureStore((state) => state.addLecture);
  const addLectureToModule = useModuleStore(
    (state) => state.addLectureToModule,
  );
  const modules = useModuleStore((state) => state.modules);

  // Get the module to find courseId
  const module = modules.find((m) => m.id === moduleId);
  const courseId = module?.courseId || '';

  // No need to fetch lectures since they're already loaded in the store
  // useEffect removed to prevent infinite loops

  // dialog state
  const [open, setOpen] = useState(false);
  // Upload progress state for simulation
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFormData = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setData((prev) => ({ ...prev, [name]: target.checked }));
    } else if (type === 'number') {
      setData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simulate file upload
    simulateUpload();

    // Create a mock video URL
    const mockVideoUrl = `https://example.com/videos/${Math.random()
      .toString(36)
      .substring(2)}.mp4`;

    // Add the lecture to our store after "upload" is complete
    setTimeout(() => {
      try {
        const newLecture = {
          title: data.title,
          description: data.description || 'No description provided',
          moduleId: moduleId,
          courseId: courseId,
          order: 0, // Will be set by the store
          videoUrl: data.videoUrl || mockVideoUrl,
          videoDuration: data.videoDuration,
          videoThumbnail: '',
          videoQuality: ['720p'] as ('480p' | '720p' | '1080p')[],
          type: data.type,
          content: data.content,
          downloadableResources: [],
          isFree: data.isFree,
          isPublished: true,
          viewCount: 0,
          completionRate: 0,
          averageWatchTime: 0,
          dropOffPoints: [],
        };

        const newLectureId = addLecture(newLecture);

        // Also add the lecture ID to the module
        addLectureToModule(moduleId, newLectureId);

        toast({
          title: 'Lecture Added Successfully',
        });

        refreshPage();
        setOpen(false);
        setData({
          title: '',
          description: '',
          moduleId: moduleId,
          videoDuration: 0,
          type: 'video',
          videoUrl: '',
          content: '',
          isFree: false,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Lecture Addition Failed',
          variant: 'destructive',
        });
      }
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2.5 rounded-full bg-meta-3 py-2 px-6 text-center font-medium text-white hover:bg-opacity-80 lg:px-4 xl:px-6">
          <PlusCircleIcon className="h-5 w-5" />
          <span>Add Lecture</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Lecture</DialogTitle>
        <form onSubmit={formSubmitHandler}>
          {/* Lecture Title */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Title
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleFormData}
                placeholder="Enter Lecture Title"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
              <span className="absolute right-4 top-4">
                <IdentificationIcon className="w-6 h-6 text-bodydark" />
              </span>
            </div>
          </div>

          {/* Lecture Description */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Description
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleFormData}
              placeholder="Enter Lecture Description"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              rows={3}
            />
          </div>

          {/* Photo upload */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Image
            </label>
            <input
              type="file"
              name="featured_image"
              onChange={handleFormData}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>

          {/* Video upload */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lecture Video
            </label>
            <input
              type="file"
              name="video_file"
              accept="video/*"
              onChange={handleFormData}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              required
            />
          </div>

          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Uploading lecture...</span>
                <span className="text-gray-600">
                  {uploadProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="mb-5">
              <input
                type="submit"
                value={isUploading ? 'Uploading...' : 'Submit'}
                disabled={isUploading}
                className="w-full font-medium cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
