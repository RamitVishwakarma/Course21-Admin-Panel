import { Modules } from '../../interfaces/Modules';

const ModuleContainer = ({ module }: { module: Modules }) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  };
  return (
    <div className="py-6 px-4 md:px-6 xl:px-7.5">
      <div className="flex gap-4 items-center ">
        <div>
          {module?.image_path ? (
            <img
              src={module?.image_path}
              alt="module"
              className="w-40 h-40 rounded-lg objet-cover"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-2 dark:bg-black text-white text-center flex items-center rounded-md">
              No image set
            </div>
          )}
        </div>
        <div>
          <h4 className="text-2xl font-semibold text-black dark:text-white">
            {module?.name}
          </h4>
          <div className="">
            Last updated at:{' '}
            {module?.updated_at
              ? new Date(module.updated_at).toLocaleString('en-IN', dateOptions)
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleContainer;