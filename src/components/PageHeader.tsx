interface PageHeaderProps {
  imageUrl?: string;
}

export default function PageHeader({ imageUrl = 'https://cdn.poehali.dev/files/4b78877a-e24a-4720-b420-fafa87d6a759.jpg' }: PageHeaderProps) {
  return (
    <img 
      src={imageUrl}
      alt="Калининград"
      className="w-full h-auto object-cover"
    />
  );
}
