function App() {
  const properties = [
  {
  name: "Sandy Feet Retreat",
  location: "Surfside Beach, SC"
  },
  {
  name: "Half Shell Beach Cottage",
  location: "Surfside Beach, SC"
  },
  {
  name: "Cape Charles Coastal Retreat",
  location: "Cape Charles, VA"
  },
  {
  name: "Lake Hartwell Waterfront Retreat",
  location: "Anderson, SC"
  },
  {
  name: "Anderson Lake Escape",
  location: "Anderson, SC"
  }
  ];
   
  return (
  <div style={{ padding: "40px", fontFamily: "Arial" }}>
  <h1>Southern Shores Vacation Rentals</h1>
  <p>
  Beach, lake, and coastal getaways across South Carolina and Virginia.
  </p>
   
  <h2>Our Properties</h2>
   
  {properties.map((property, index) => (
  <div
  key={index}
  style={{
  border: "1px solid #ddd",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "8px"
  }}
  >
  <h3>{property.name}</h3>
  <p>{property.location}</p>
  <button>Reserve Now</button>
  </div>
  ))}
  </div>
  );
  }
   
  export default App;
  