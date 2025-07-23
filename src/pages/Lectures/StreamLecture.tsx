import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useLectureStore,
  type LectureNote,
  type LectureBookmark,
} from '../../store/useLectureStore';
import { useModuleStore } from '../../store/useModuleStore';
import { useCourseStore } from '../../store/useCourseStore';
import { useUserStore } from '../../store/useUserStore';
import { type Lecture, type Module, type Course } from '../../types';
import VideoPlayer from '../../components/VideoPlayer';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  PencilIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const StreamLecture = () => {
  const { lectureId, moduleId, courseId } = useParams<{
    lectureId: string;
    moduleId: string;
    courseId: string;
  }>();
  const navigate = useNavigate();

  const {
    fetchLectureById,
    fetchLecturesByModuleId,
    getLectureNotes,
    getLectureBookmarks,
    addLectureNote,
    addLectureBookmark,
    deleteLectureNote,
    deleteLectureBookmark,
    getVideoProgress,
    getLectureCompletion,
  } = useLectureStore();

  const { fetchModuleById } = useModuleStore();
  const { fetchCourseById } = useCourseStore();
  const { user: currentUser } = useUserStore();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [moduleLectures, setModuleLectures] = useState<Lecture[]>([]);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [bookmarks, setBookmarks] = useState<LectureBookmark[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const userId = currentUser?.id || 'demo-user';

  useEffect(() => {
    if (lectureId && moduleId && courseId) {
      setIsLoading(true);

      // Fetch lecture details
      const lectureData = fetchLectureById(lectureId);
      setLecture(lectureData || null);

      // Fetch module details
      const moduleData = fetchModuleById(moduleId);
      setModule(moduleData || null);

      // Fetch course details
      const courseData = fetchCourseById(courseId);
      setCourse(courseData || null);

      // Fetch all lectures in this module
      const moduleLecturesData = fetchLecturesByModuleId(moduleId);
      setModuleLectures(moduleLecturesData);

      // Find current lecture index
      const currentIndex = moduleLecturesData.findIndex(
        (l) => l.id === lectureId,
      );
      setCurrentLectureIndex(currentIndex);

      setIsLoading(false);
    }
  }, [
    lectureId,
    moduleId,
    courseId,
    fetchLectureById,
    fetchModuleById,
    fetchCourseById,
    fetchLecturesByModuleId,
  ]);

  useEffect(() => {
    if (lectureId && userId) {
      // Load notes and bookmarks
      const lectureNotes = getLectureNotes(lectureId, userId);
      const lectureBookmarks = getLectureBookmarks(lectureId, userId);
      setNotes(lectureNotes);
      setBookmarks(lectureBookmarks);
    }
  }, [lectureId, userId, getLectureNotes, getLectureBookmarks]);

  const handleAddNote = () => {
    if (newNote.trim() && lectureId) {
      addLectureNote(lectureId, userId, currentTimestamp, newNote);
      const updatedNotes = getLectureNotes(lectureId, userId);
      setNotes(updatedNotes);
      setNewNote('');
    }
  };

  const handleAddBookmark = () => {
    if (newBookmarkTitle.trim() && lectureId) {
      addLectureBookmark(lectureId, userId, currentTimestamp, newBookmarkTitle);
      const updatedBookmarks = getLectureBookmarks(lectureId, userId);
      setBookmarks(updatedBookmarks);
      setNewBookmarkTitle('');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteLectureNote(noteId);
    const updatedNotes = getLectureNotes(lectureId!, userId);
    setNotes(updatedNotes);
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    deleteLectureBookmark(bookmarkId);
    const updatedBookmarks = getLectureBookmarks(lectureId!, userId);
    setBookmarks(updatedBookmarks);
  };

  const navigateToLecture = (direction: 'previous' | 'next') => {
    const newIndex =
      direction === 'previous'
        ? currentLectureIndex - 1
        : currentLectureIndex + 1;
    if (newIndex >= 0 && newIndex < moduleLectures.length) {
      const newLecture = moduleLectures[newIndex];
      navigate(
        `/admin/course/${courseId}/module/${moduleId}/lecture/${newLecture.id}/stream`,
      );
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLectureStatus = () => {
    if (!lectureId) return null;

    const completion = getLectureCompletion(lectureId, userId);
    const progress = getVideoProgress(lectureId, userId);

    return {
      completed: completion?.completed || false,
      progressPercentage: completion?.progressPercentage || 0,
      currentTime: progress?.currentTime || 0,
      totalDuration: progress?.totalDuration || lecture?.videoDuration || 0,
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Lecture not found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The requested lecture could not be found.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const lectureStatus = getLectureStatus();

  return (
    <div className="space-y-6">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/admin/view-course/${courseId}/view-module/${moduleId}`)
            }
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Module
          </Button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {course?.title} → {module?.title}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigateToLecture('previous')}
            disabled={currentLectureIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Previous
          </Button>

          <Badge variant="secondary">
            {currentLectureIndex + 1} / {moduleLectures.length}
          </Badge>

          <Button
            variant="outline"
            onClick={() => navigateToLecture('next')}
            disabled={currentLectureIndex === moduleLectures.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lecture Title and Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lecture.title}
          </h1>

          {lectureStatus?.completed && (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircleIcon className="h-4 w-4" />
              Completed
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            {formatTime(lecture.videoDuration)}
          </div>

          {lectureStatus && lectureStatus.progressPercentage > 0 && (
            <div className="flex items-center gap-1">
              <PlayIcon className="h-4 w-4" />
              {Math.round(lectureStatus.progressPercentage)}% watched
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-0">
              <VideoPlayer
                lectureId={lecture.id}
                src={lecture.videoUrl}
                title={lecture.title}
                onProgress={(time) => setCurrentTimestamp(time)}
              />
            </CardContent>
          </Card>

          {/* Lecture Description */}
          <Card>
            <CardHeader>
              <CardTitle>About this lecture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                {lecture.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Notes and Bookmarks */}
        <div className="space-y-4">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <PencilIcon className="h-4 w-4" />
                Notes ({notes.length})
              </TabsTrigger>
              <TabsTrigger
                value="bookmarks"
                className="flex items-center gap-2"
              >
                <BookmarkIcon className="h-4 w-4" />
                Bookmarks ({bookmarks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Add Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-gray-500">
                    At {formatTime(currentTimestamp)}
                  </div>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note at current timestamp..."
                    className="w-full p-2 border rounded-md resize-none h-20"
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    size="sm"
                    className="w-full"
                  >
                    Add Note
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notes.map((note) => (
                  <Card key={note.id} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs text-gray-500">
                        {formatTime(note.timestamp)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </Card>
                ))}

                {notes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notes yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Add Bookmark</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-gray-500">
                    At {formatTime(currentTimestamp)}
                  </div>
                  <input
                    type="text"
                    value={newBookmarkTitle}
                    onChange={(e) => setNewBookmarkTitle(e.target.value)}
                    placeholder="Bookmark title..."
                    className="w-full p-2 border rounded-md"
                  />
                  <Button
                    onClick={handleAddBookmark}
                    disabled={!newBookmarkTitle.trim()}
                    size="sm"
                    className="w-full"
                  >
                    Add Bookmark
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {bookmarks.map((bookmark) => (
                  <Card key={bookmark.id} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs text-gray-500">
                        {formatTime(bookmark.timestamp)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookmarkSolidIcon className="h-4 w-4 text-yellow-500" />
                      <p className="text-sm font-medium">{bookmark.title}</p>
                    </div>
                  </Card>
                ))}

                {bookmarks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookmarkIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No bookmarks yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StreamLecture;
