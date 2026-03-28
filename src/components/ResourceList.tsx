import { ResourceCard } from './ResourceCard';

interface Resource {
  title: string;
  description: string;
  phone?: string;
  website?: string;
  category: string;
  color: string;
}

interface ResourceListProps {
  resources: Resource[];
}

export function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="p-12 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
        <p className="text-gray-500 dark:text-gray-400">No resources found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {resources.map((resource, index) => (
        <ResourceCard
          key={index}
          title={resource.title}
          description={resource.description}
          phone={resource.phone}
          website={resource.website}
          category={resource.category}
        />
      ))}
    </div>
  );
}
