import { Icon } from "@iconify/react";

export default function ExtrusionMachineryCard({ id, heading, sub, link, onEdit, onDelete }) {
  console.log(heading);
  console.log(sub);
  console.log(link);

  // Add "https://" if the link doesn't already have a protocol
  const formattedLink = link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;

  return (
    <div className="flex flex-row">
      <div>
        <div className="font-semibold text-[18px]">{heading}</div>
        <div className="text-[16px]">{sub}</div>
        <a href={formattedLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          {link}
        </a>
      </div>

      <div className='flex flex-col'>
        <button onClick={() => onEdit(id)} className="text-black text-3xl py-1 px-2 rounded mb-2">
          <Icon icon="tabler:edit" />
        </button>
        <button onClick={() => onDelete(id)} className="text-black text-3xl py-1 px-2 rounded">
          <Icon icon="ic:twotone-delete" />
        </button>
      </div>
    </div>
  );
}
