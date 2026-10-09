import React from "react";

function App() {
  const properties = [
    {
      name: "Cape Escape",
      location: "Cape Charles, Virginia",
      details: "Sleeps 8 • Pet Friendly • Walk to Beach",
      image: "/images/Cape Escape/Cover.jpeg",
    },
    {
      name: "Sandy Feet Retreat",
      location: "Surfside Beach, South Carolina",
      details: "Sleeps 10 • Pet Friendly • Golf Cart Available",
      image: "/images/Sandy Feet Retreat/Cover.jpeg",
    },
    {
      name: "Half Shell Beach Cottage",
      location: "Surfside Beach, South Carolina",
      details: "Sleeps 6 • One Block to Beach",
      image: "/images/Half Shell/Cover.jpeg",
    },
    {
      name: "Tiger Town Lake Escape",
      location: "Lake Hartwell, South Carolina",
      details: "Sleeps 15 • Dock • Game Room",
      image: "/images/Tiger Town Lake Escape/Cover.jpeg",
    },
    {
      name: "Tiger Town Lake Side Retreat",
      location: "Lake Hartwell, South Carolina",
      details: "Sleeps 12 • Log Cabin • Firepit",
      image: "/images/Tiger Town Lake Side Retreat/Cover.jpeg",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f3ed",
        fontFamily: "Arial, sans-serif",
        padding: "40px",
      }}
    >
      <header
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            color: "#123c4a",
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          Southern Shores Vacation Rentals
        </h1>

        <p
          style={{
            color: "#557078",
            fontSize: "18px",
          }}
        >
          Beach • Coastal • Lakefront Escapes
        </p>
      </header>

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        {properties.map((property) => (
          <article
            key={property.name}
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 5px 18px rgba(0,0,0,0.12)",
            }}
          >
          <img
           src= {property.image}
           alt= {property.name} style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            display: "block",
          }}/>

            <div
              style={{
                padding: "22px",
              }}
            >
              <h2
                style={{
                  color: "#123c4a",
                  marginTop: "0",
                  marginBottom: "8px",
                }}
              >
                {property.name}
              </h2>

              <p
                style={{
                  color: "#65777c",
                  marginBottom: "14px",
                }}
              >
                {property.location}
              </p>

              <p
                style={{
                  color: "#344e55",
                  lineHeight: "1.6",
                }}
              >
                {property.details}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;