import { useState, useEffect, createElement } from "react";

function PropertyRates({ property }) {
  return (
    <section
      style={{
        marginTop: "28px",
        paddingTop: "24px",
        borderTop: "1px solid #d9e2e4",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px",
          color: "#153e49",
          fontSize: "26px",
        }}
      >
        Rates & Fees
      </h3>

      <div
        style={{
          backgroundColor: "#f7faf9",
          border: "1px solid #d9e5e0",
          borderRadius: "12px",
          padding: "18px",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#153e49",
            marginBottom: "14px",
          }}
        >
          Base rate: ${property.baseRate}/night
        </div>

        <div
          style={{
            lineHeight: "1.9",
            color: "#4f646a",
          }}
        >
          <div>Cleaning fee: ${property.cleaningFee} per stay</div>
          <div>Pet fee: ${property.petFee} per stay</div>
          <div>Weekly stay discount: {property.weeklyDiscount}%</div>
          <div>Monthly stay discount: {property.monthlyDiscount}%</div>
        </div>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: "13px",
            color: "#74868a",
          }}
        >
          Nightly rates may vary by date and season.
        </p>
      </div>
    </section>
  );
}
function AvailabilityCalendar({ property }) {
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    if (!property?.availabilityKey) return;

    const controller = new AbortController();

    setLoading(true);
    setError("");

    fetch(
      "/api/availability?property=" +
        encodeURIComponent(property.availabilityKey),
      { signal: controller.signal }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load availability");
        return response.json();
      })
      .then((data) => {
        setBlockedDates(Array.isArray(data.blocked) ? data.blocked : []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Availability calendar error:", err);
          setError("Availability error: " + err.message);
          setLoading(false);
        }
      }); 

    return () => controller.abort();
  }, [property?.availabilityKey]);

  const today = new Date();

  const displayMonth = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1
  );

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = displayMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const toDateString = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const isBlocked = (date) => {
    const dateString = toDateString(date);

    return blockedDates.some(
      ({ start, end }) => dateString >= start && dateString < end
    );
  };

  const days = [];

  for (let i = 0; i < firstDay; i += 1) {
    days.push(<div key={`blank-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const blocked = isBlocked(date);

    days.push(
      <div
        key={day}
        title={blocked ? "Unavailable" : "Available"}
        style={{
          padding: "12px 4px",
          textAlign: "center",
          borderRadius: "8px",
          fontWeight: "bold",
          background: blocked ? "#e4e7e8" : "#e7f4eb",
          color: blocked ? "#7c8588" : "#245c3d",
          textDecoration: blocked ? "line-through" : "none",
        }}
      >
        {day}
      </div>
    );
  }

  return (
    <section
      style={{
        marginTop: "28px",
        paddingTop: "24px",
        borderTop: "1px solid #d9e2e4",
      }}
    >
      <h3 style={{ color: "#153e49", fontSize: "26px" }}>
        Availability
      </h3>

      {loading && <p>Loading availability...</p>}

      {error && <p style={{ color: "#a33a3a" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <button
              type="button"
              disabled={monthOffset === 0}
              onClick={() =>
                setMonthOffset((current) => Math.max(0, current - 1))
              }
            >
              ← Previous
            </button>

            <strong>{monthName}</strong>

            <button
              type="button"
              onClick={() => setMonthOffset((current) => current + 1)}
            >
              Next
            </button> 
            </div>
  
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "6px",
                textAlign: "center",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#5f7479",
              }}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (name) => (
                  <div key={name}>{name}</div>
                )
              )}
            </div>
  
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "6px",
              }}
            >
              {days}
            </div>
  
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "16px",
              }}
            >
              <span>🟢 Available</span>
              <span>⚪ Unavailable</span>
            </div>
  
            <p
              style={{
                fontSize: "13px",
                color: "#74868a",
                marginTop: "12px",
              }}
            >
              Availability is subject to confirmation.
            </p>
          </>
        )}
      </section>
    );
  }

function App() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const properties = [
    {
      name: "Cape Escape",
      availabilityKey: "cape-escape",
      location: "Cape Charles, Virginia",
      details: "Pet Friendly • Walk to Beach • Sleeps 8", 
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
      availabilityKey: "sandy-feet",
      location: "Surfside Beach, South Carolina",
      details: "Pet Friendly • Steps to Beach • Sleeps 10", 
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
      availabilityKey: "half-shell",
      location: "Surfside Beach, South Carolina",
      details: "Pet Friendly • Steps to Beach • Sleeps 6", 
      photos: [
        "/images/Half Shell/Cover.jpeg",
        ...Array.from(
          { length: 9 },
          (_, i) => `/images/Half Shell/Photo${i + 2}.jpeg`
        ),
      ],
    },
    {
      name: "Tiger Town Lake Side Retreat",
      availabilityKey: "tiger-town-lakeside",
      location: "Lake Hartwell, South Carolina",
      details: "Pet Friendly • Fire Pit • 1.3 acres Fenced Yard • Sleeps 12", 
      photos: [
        "/images/Tiger Town Lake Escape/Cover.jpeg",
        ...Array.from(
          { length: 30 },
          (_, i) => `/images/Tiger Town Lake Escape/Photo${i + 2}.jpeg`
        ),
      ],
    },
    {
      name: "Tiger Town Lake Escape",
      availabilityKey: "tiger-town-escape",
      location: "Lake Hartwell, South Carolina",
      details: "Pet Friendly • Waterfall • Firepit • Sleeps 15", 
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

  function contactButton(label, href, filled = false) {
    return createElement(
      "a",
      {
        href,
        style: {
          display: "inline-block",
          padding: "15px 26px",
          border: "2px solid #cca25d",
          borderRadius: "8px",
          backgroundColor: filled ? "#cca25d" : "transparent",
          color: filled ? "#083c4b" : "white",
          textDecoration: "none",
          fontSize: "17px",
          fontWeight: "bold",
        },
      },
      label
    );
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
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
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

      <section
        style={{
          padding: "65px 24px",
          textAlign: "center",
          color: "white",
          backgroundColor: "#083c4b",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              color: "#cca25d",
              letterSpacing: "3px",
              fontWeight: "bold",
            }}
          >
            SOUTHERN SHORES VACATION RENTALS
          </p>

          <h2
            style={{
              margin: "0 0 15px",
              fontFamily: "Georgia, serif",
              fontSize: "clamp(32px, 5vw, 42px)",
            }}
          >
            Ready to Plan Your Stay?
          </h2>

          <p
            style={{
              maxWidth: "650px",
              margin: "0 auto 30px",
              color: "#e4edef",
              fontSize: "18px",
              lineHeight: 1.6,
            }}
          >
            Have questions about one of our properties, availability,
            or your upcoming stay? Contact Ashley directly by phone,
            text, or email.
          </p>

          <div
            style={{
              padding: "28px",
              marginBottom: "28px",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            <h3
              style={{
                margin: "0 0 18px",
                fontFamily: "Georgia, serif",
                fontSize: "27px",
              }}
            >
              Contact: Ashley Sabo
            </h3>

            <p
              style={{
                margin: "8px 0",
                fontSize: "18px",
              }}
            >
              Phone/Text: (980) 722-7660
            </p>

            <p
              style={{
                margin: "8px 0",
                fontSize: "18px",
              }}
            >
              Email: Essabo@aol.com
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "14px",
            }}
          >
            {contactButton(
              "Call Ashley",
              "tel:+19807227660",
              true
            )}

            {contactButton(
              "Text Ashley",
              "sms:+19807227660"
            )}

            {contactButton(
              "Email Ashley",
              "mailto:Essabo@aol.com"
            )}
          </div>
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

                <p
                  style={{
                    margin: 0,
                    color: "#77878b",
                  }}
                >
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
              {galleryImage(
                selectedProperty,
                selectedPhoto
              )}

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
                {selectedProperty.photos.map(
                  (photo, index) => (
                    <button
                      key={photo}
                      type="button"
                      onClick={() =>
                        setSelectedPhoto(index)
                      }
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
                      {thumbnailImage(
                        selectedProperty,
                        photo,
                        index
                      )}
                    </button>
                  )
                )}
              </div>

              <AvailabilityCalendar property={selectedProperty} />

            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
