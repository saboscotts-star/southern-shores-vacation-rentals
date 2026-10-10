import { useState, createElement } from "react";

function App() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const properties = [
    {
      name: "Cape Escape",
      location: "Cape Charles, Virginia",
      details: "Pet Friendly • Walk to Beach",
      photos: [
        "/images/Cape Escape/Cover.jpeg",
        ...Array.from(
          { length: 23 },
          (_, i) => `/images/Cape Escape/Photo${i + 2}.jpeg`
        ),
      ],
    },

    {
      name: "Sandy Feet Retreat",
      location: "Surfside Beach, South Carolina",
      details: "Pet Friendly • Beach Getaway",
      photos: [
        "/images/Sandy Feet Retreat/Cover.jpeg",
        ...Array.from(
          { length: 19 },
          (_, i) => `/images/Sandy Feet Retreat/Photo${i + 2}.jpeg`
        ),
      ],
    },

    {
      name: "Half Shell Beach Cottage",
      location: "Surfside Beach, South Carolina",
      details: "Coastal Cottage • Close to Beach",
      photos: [
        "/images/Half Shell/Cover.jpeg",
        ...Array.from(
          { length: 9 },
          (_, i) => `/images/Half Shell/Photo${i + 2}.jpeg`
        ),
      ],
    },

    {
      name: "Tiger Town Lake Escape",
      location: "Lake Hartwell, South Carolina",
      details: "Waterfront • Dock • Lake Getaway",
      photos: [
        "/images/Tiger Town Lake Escape/Cover.jpeg",
        ...Array.from(
          { length: 30 },
          (_, i) => `/images/Tiger Town Lake Escape/Photo${i + 2}.jpeg`
        ),
      ],
    },

    {
      name: "Tiger Town Lake Side Retreat",
      location: "Lake Hartwell, South Carolina",
      details: "Lake Retreat • Cabin • Firepit",
      photos: [
        "/images/Tiger Town Lake Side Retreat/Cover.jpeg",
        ...Array.from(
          { length: 29 },
          (_, i) =>
            `/images/Tiger Town Lake Side Retreat/Photo${i + 2}.jpeg`
        ),
      ],
    },
  ];

  function openProperty(property) {
    setSelectedProperty(property);
    setSelectedPhoto(0);
  }

  function closeProperty() {
    setSelectedProperty(null);
    setSelectedPhoto(0);
  }

  function previousPhoto(event) {
    event.stopPropagation();

    setSelectedPhoto((current) =>
      current === 0
        ? selectedProperty.photos.length - 1
        : current - 1
    );
  }

  function nextPhoto(event) {
    event.stopPropagation();

    setSelectedPhoto((current) =>
      current === selectedProperty.photos.length - 1
        ? 0
        : current + 1
    );
  }

  function propertyCover(property) {
    return createElement("img", {
      src: property.photos[0],
      alt: property.name,
      loading: "lazy",
      style: {
        width: "100%",
        height: "270px",
        objectFit: "cover",
        display: "block",
      },
    });
  }

  function galleryImage(property, photoIndex) {
    return createElement("img", {
      src: property.photos[photoIndex],
      alt: `${property.name} photo ${photoIndex + 1}`,
      style: {
        width: "100%",
        height: "min(60vh, 600px)",
        objectFit: "contain",
        display: "block",
        backgroundColor: "#08151a",
      },
    });
  }

  function thumbnailImage(property, photo, index) {
    return createElement("img", {
      src: photo,
      alt: `${property.name} photo ${index + 1}`,
      loading: "lazy",
      style: {
        width: "100%",
        height: "90px",
        objectFit: "cover",
        display: "block",
      },
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        backgroundColor: "#f7f4ed",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          padding: "70px 20px",
          textAlign: "center",
          color: "white",
          background:
            "linear-gradient(135deg, #083c4b 0%, #087184 55%, #cca25d 100%)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            letterSpacing: "3px",
            fontWeight: "bold",
          }}
        >
          BEACH • COASTAL • LAKEFRONT
        </p>

        <h1
          style={{
            margin: 0,
            fontFamily: "Georgia, serif",
            fontSize: "clamp(40px, 6vw, 70px)",
          }}
        >
          Southern Shores Vacation Rentals
        </h1>

        <p
          style={{
            maxWidth: "720px",
            margin: "18px auto 0",
            fontSize: "18px",
            lineHeight: 1.6,
          }}
        >
          Explore our vacation homes in Cape Charles, Surfside Beach,
          and Lake Hartwell.
        </p>
      </header>

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "55px 24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 35px",
            textAlign: "center",
            color: "#153e49",
            fontFamily: "Georgia, serif",
            fontSize: "38px",
          }}
        >
          Our Properties
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          {properties.map((property) => (
            <article
              key={property.name}
              onClick={() => openProperty(property)}
              style={{
                overflow: "hidden",
                borderRadius: "16px",
                backgroundColor: "white",
                boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                cursor: "pointer",
              }}
            >
              {propertyCover(property)}

              <div style={{ padding: "22px" }}>
                <h3
                  style={{
                    margin: "0 0 8px",
                    color: "#153e49",
                    fontFamily: "Georgia, serif",
                    fontSize: "26px",
                  }}
                >
                  {property.name}
                </h3>

                <p
                  style={{
                    margin: "0 0 10px",
                    color: "#78878b",
                  }}
                >
                  {property.location}
                </p>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#3c565d",
                    lineHeight: 1.5,
                  }}
                >
                  {property.details}
                </p>

                <div
                  style={{
                    color: "#087184",
                    fontWeight: "bold",
                  }}
                >
                  View Photos →
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedProperty && (
        <div
          onClick={closeProperty}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backgroundColor: "rgba(0,15,20,0.92)",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(1000px, 100%)",
              maxHeight: "92vh",
              overflowY: "auto",
              borderRadius: "18px",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                padding: "20px 24px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: "0 0 5px",
                    color: "#153e49",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {selectedProperty.name}
                </h2>

                <p style={{ margin: 0, color: "#77878b" }}>
                  {selectedProperty.location}
                </p>
              </div>

              <button
                type="button"
                onClick={closeProperty}
                aria-label="Close photo gallery"
                style={{
                  width: "42px",
                  height: "42px",
                  border: 0,
                  borderRadius: "50%",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>

            <div
              style={{
                position: "relative",
                backgroundColor: "#08151a",
              }}
            >
              {galleryImage(selectedProperty, selectedPhoto)}

              <button
                type="button"
                onClick={previousPhoto}
                aria-label="Previous photo"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "18px",
                  width: "50px",
                  height: "50px",
                  border: 0,
                  borderRadius: "50%",
                  color: "white",
                  fontSize: "26px",
                  backgroundColor: "rgba(0,0,0,0.65)",
                  cursor: "pointer",
                  transform: "translateY(-50%)",
                }}
              >
                ←
              </button>

              <button
                type="button"
                onClick={nextPhoto}
                aria-label="Next photo"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "18px",
                  width: "50px",
                  height: "50px",
                  border: 0,
                  borderRadius: "50%",
                  color: "white",
                  fontSize: "26px",
                  backgroundColor: "rgba(0,0,0,0.65)",
                  cursor: "pointer",
                  transform: "translateY(-50%)",
                }}
              >
                →
              </button>
            </div>

            <div
              style={{
                padding: "20px 24px 28px",
              }}
            >
              <p
                style={{
                  margin: "0 0 18px",
                  color: "#3c565d",
                  fontWeight: "bold",
                }}
              >
                Photo {selectedPhoto + 1} of{" "}
                {selectedProperty.photos.length}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "10px",
                }}
              >
                {selectedProperty.photos.map((photo, index) => (
                  <button
                    key={photo}
                    type="button"
                    onClick={() => setSelectedPhoto(index)}
                    aria-label={`View photo ${index + 1}`}
                    style={{
                      padding: 0,
                      overflow: "hidden",
                      border:
                        selectedPhoto === index
                          ? "3px solid #087184"
                          : "3px solid transparent",
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {thumbnailImage(selectedProperty, photo, index)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;