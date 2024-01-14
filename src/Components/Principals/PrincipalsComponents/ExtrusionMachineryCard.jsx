export default function ExtrusionMachineryCard({ heading, sub, link, onOrderChange }) {
  console.log(heading);
  console.log(sub);
  console.log(link);
  // Add "https://" if the link doesn't already have a protocol
  // const formattedLink = link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;

  // const handleOrderChange = (newOrder) => {
  //   onOrderChange(newOrder);
  // };

  return (
    <div>
      <div className="font-semibold text-[18px]">{heading}</div>
      <div className="text-[16px]">{sub}</div>
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary underline">
        {link}
      </a>

      {/* <button
        className="bg-gray-300 text-gray-700 px-2 py-1 rounded-md"
        onClick={() => handleOrderChange(prompt('Enter new order:'))}
      >
        Change Order
      </button> */}
    </div>
  );
}
