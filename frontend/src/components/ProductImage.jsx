function ProductImage({ name, image }) {
  if (image) {
    return (
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img src={image} alt={name || "Product"} className="w-full h-full object-cover" />
      </div>
    );
  }
  const n = (name || "").toLowerCase();
  const isPaneer = n.includes("paneer") || n.includes("panner");
  const isCowMilk = n.includes("cow") && n.includes("milk");
  const isBuffaloMilk = n.includes("buffalo") && n.includes("milk");
  const isGhee = n.includes("ghee");
  if (isPaneer) {
    return (
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src="/paneer.jpg"
          alt="Paneer"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }
  if (isCowMilk) {
    return (
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src="/cowimage.jpg"
          alt="Cow Milk"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }
  if (isBuffaloMilk) {
    return (
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src="/Buffalomilk.jpg"
          alt="Buffalo Milk"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }
  let svg = null;
  if (isGhee) {
    svg = (
      <img
        src="/Ghee.jpg"
        alt="Ghee"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  } else if (n.includes("buffalo")) {
    svg = (
      <svg width="96" height="96" viewBox="0 0 24 24" fill="none" className="text-indigo-700">
        <path d="M7 4h10l1 2v5a4 4 0 0 1-8 0V6l-3-2Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  } else if (n.includes("milk")) {
    svg = (
      <svg width="96" height="96" viewBox="0 0 24 24" fill="none" className="text-blue-600">
        <path d="M9 3h6l1 2v4a4 4 0 0 1-8 0V5l1-2Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 9v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  } else {
    svg = (
      <svg width="96" height="96" viewBox="0 0 24 24" fill="none" className="text-gray-700">
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      {svg}
    </div>
  );
}

export default ProductImage;
