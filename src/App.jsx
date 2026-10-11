import { createElement, useEffect, useState } from "react";

const properties = [
  {
    name: "Cape Escape",
    availabilityKey: "cape-escape",
    location: "Cape Charles, Virginia",
    details: "Pet Friendly • Walk to Beach • Sleeps 8",
    photos: [
      "/images/Cape Escape/Cover.jpeg",
      ...Array.from({ length: 23 }, (_, i) => `/images/Cape Escape/Photo${i + 2}.jpeg`),
    ],
  },
  {
    name: "Sandy Feet Retreat",
    availabilityKey: "sandy-feet",
    location: "Surfside Beach, South Carolina",
    details: "Pet Friendly • Beach Getaway • Sleeps 10",
    photos: [
      "/images/Sandy Feet Retreat/Cover.jpeg",
      ...Array.from({ length: 19 }, (_, i) => `/images/Sandy Feet Retreat/Photo${i + 2}.jpeg`),
    ],
  },
  {
    name: "Half Shell Beach Cottage",
    availabilityKey: "half-shell",
    location: "Surfside Beach, South Carolina",
    details: "Pet Friendly • Coastal Cottage • Close to Beach • Sleeps 6",
    photos: [
      "/images/Half Shell/Cover.jpeg",
      ...Array.from({ length: 9 }, (_, i) => `/images/Half Shell/Photo${i + 2}.jpeg`),
    ],
  },
  {
    name: "Tiger Town Lake Escape",
    availabilityKey: "tiger-town-escape",
    location: "Lake Hartwell, South Carolina",
    details: "Pet Friendly • Lake Retreat • Cabin • Firepit • Sleeps 15",
    photos: [
      "/images/Tiger Town Lake Escape/Cover.jpeg",
      ...Array.from({ length: 30 }, (_, i) => `/images/Tiger Town Lake Escape/Photo${i + 2}.jpeg`),
    ],
  },
  {
    name: "Tiger Town Lake Side Retreat",
    availabilityKey: "tiger-town-lakeside",
    location: "Lake Hartwell, South Carolina",
    details: "Pet Friendly • Waterfront • Fire Pit • Lake Getaway • Sleeps 12",
    photos: [
      "/images/Tiger Town Lake Side Retreat/Cover.jpeg",
      ...Array.from({ length: 29 }, (_, i) => `/images/Tiger Town Lake Side Retreat/Photo${i + 2}.jpeg`),
    ],
  },
];

function AvailabilityCalendar({ property }) {
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadAvailability() {
      try {
        setLoading(true);
        setError("");

        const url = `/api/availability?property=${encodeURIComponent(
          property.availabilityKey
        )}`;

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Unable to load availability (${response.status})`);
        }

        const data = await response.json();
        setBlockedDates(Array.isArray(data.blocked) ? data.blocked : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Availability calendar error:", err);
          setError(err.message || "Unable to load availability");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAvailability();
    return () => controller.abort();
  }, [property.availabilityKey]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthTitle = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  function formatDate(day) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  function isBlocked(dateString) {
    return blockedDates.some((range) => {
      if (!range || typeof range.start !== "string") return false;
      const start = range.start.slice(0, 10);
      const end =
        typeof range.end === "string" ? range.end.slice(0, 10) : start;
      return dateString >= start && dateString < end;
    });
  }

  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push(<div key={`blank-${i}`} style={styles.blankDay} />);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const isoDate = formatDate(day);
    const blocked = isBlocked(isoDate);
    cells.push(
      <div
        key={isoDate}
        title={blocked ? "Unavailable" : "Available"}
        style={{
          ...styles.calendarDay,
          backgroundColor: blocked ? "#dedede" : "#e7f5eb",
          color: blocked ? "#737373" : "#245c38",
        }}
      >
        {day}
      </div>
    );
  }

  return (
    <section style={styles.calendarSection}>
      <h2 style={styles.calendarTitle}>Availability</h2>
      {loading && <p style={styles.centerText}>Loading Vrbo availability...</p>}
      {error && (
        <p style={styles.errorText}>Availability error: {error}</p>
      )}
      {!loading && !error && (
        <>
          <div style={styles.calendarHeader}>
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              style={styles.monthButton}
            >
              ‹
            </button>
            <h3 style={styles.monthTitle}>{monthTitle}</h3>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              style={styles.monthButton}
            >
              ›
            </button>
          </div>

          <div style={styles.weekdayGrid}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={styles.weekday}>{day}</div>
            ))}
          </div>
          <div style={styles.calendarGrid}>{cells}</div>

          <div style={styles.legend}>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendBox, backgroundColor: "#e7f5eb" }} />
              Available
            </span>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendBox, backgroundColor: "#dedede" }} />
              Unavailable
            </span>
          </div>
          <p style={styles.calendarNote}>Availability is synchronized with Vrbo.</p>
        </>
      )}
    </section>
  );
}

function ContactSection() {
  return (
    <section style={styles.contact}>
      <h2 style={{ marginTop: 0 }}>Ready to Plan Your Stay?</h2>
      <p>Contact Ashley directly with questions about a property or availability.</p>
      <p><strong>Contact:</strong> Ashley Sabo</p>
      <p><strong>Phone/Text:</strong> (980) 722-7660</p>
      <p><strong>Email:</strong> essabo@aol.com</p>
      <div style={styles.contactButtons}>
        <a href="tel:+19807227660" style={styles.contactButton}>Call Ashley</a>
        <a href="sms:+19807227660" style={styles.contactButton}>Text Ashley</a>
        <a href="mailto:essabo@aol.com" style={styles.contactButton}>Email Ashley</a>
      </div>
    </section>
  );
}

export default function App() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  function openProperty(property) {
    setSelectedProperty(property);
    setSelectedPhoto(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeProperty() {
    setSelectedProperty(null);
    setSelectedPhoto(0);
  }

  if (selectedProperty) {
    const photos = selectedProperty.photos;
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <h1 style={styles.logo}>Southern Shores Vacation Rentals</h1>
          <button type="button" onClick={closeProperty} style={styles.backButton}>
            ← Back to Properties
          </button>
        </header>

        <main style={styles.detailContainer}>
          <h1 style={styles.propertyTitle}>{selectedProperty.name}</h1>
          <p style={styles.location}>{selectedProperty.location}</p>
          <p style={styles.details}>{selectedProperty.details}</p>

          <div style={styles.heroWrapper}>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() =>
                setSelectedPhoto((current) =>
                  current === 0 ? photos.length - 1 : current - 1
                )
              }
              style={{ ...styles.arrow, left: 15 }}
            >
              ‹
            </button>
            {createElement("img", {
              src: photos[selectedPhoto],
              alt: `${selectedProperty.name} ${selectedPhoto + 1}`,
              style: styles.heroImage,
            })}
            <button
              type="button"
              aria-label="Next photo"
              onClick={() =>
                setSelectedPhoto((current) =>
                  current === photos.length - 1 ? 0 : current + 1
                )
              }
              style={{ ...styles.arrow, right: 15 }}
            >
              ›
            </button>
          </div>

          <h2 style={styles.photoCounter}>
            Photo {selectedPhoto + 1} of {photos.length}
          </h2>

          <div style={styles.thumbnailGrid}>
            {photos.map((photo, index) => (
              <button
                type="button"
                key={photo}
                onClick={() => setSelectedPhoto(index)}
                style={styles.thumbnailButton}
              >
                {createElement("img", {
                  src: photo,
                  alt: `${selectedProperty.name} thumbnail ${index + 1}`,
                  style: {
                    ...styles.thumbnail,
                    borderColor: selectedPhoto === index ? "#22768a" : "transparent",
                  },
                })}
              </button>
            ))}
          </div>

          <AvailabilityCalendar property={selectedProperty} />
        </main>
        <ContactSection />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.heroHeader}>
        <h1 style={styles.mainTitle}>Southern Shores Vacation Rentals</h1>
        <p style={styles.tagline}>Beach escapes and lake retreats for your next getaway</p>
      </header>
      <main style={styles.main}>
        <h2 style={styles.sectionTitle}>Our Properties</h2>
        <div style={styles.propertyGrid}>
          {properties.map((property) => (
            <article key={property.name} style={styles.card}>
              {createElement("img", {
                src: property.photos[0],
                alt: property.name,
                style: styles.cardImage,
              })}
              <div style={styles.cardContent}>
                <h2 style={{ marginBottom: 6 }}>{property.name}</h2>
                <p style={styles.location}>{property.location}</p>
                <p style={styles.details}>{property.details}</p>
                <button
                  type="button"
                  onClick={() => openProperty(property)}
                  style={styles.viewButton}
                >
                  View Property
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <ContactSection />
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f7f4ee", color: "#334b52", fontFamily: "Arial, Helvetica, sans-serif" },
  heroHeader: { background: "#154f5d", color: "white", textAlign: "center", padding: "54px 20px" },
  header: { background: "#154f5d", color: "white", padding: 24, textAlign: "center" },
  logo: { marginTop: 0 },
  mainTitle: { margin: 0, fontSize: 42 },
  tagline: { fontSize: 18, marginBottom: 0 },
  main: { maxWidth: 1200, margin: "0 auto", padding: "44px 20px" },
  sectionTitle: { textAlign: "center", fontSize: 32, marginBottom: 30 },
  propertyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 },
  card: { background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,.12)" },
  cardImage: { width: "100%", height: 240, objectFit: "cover", display: "block" },
  cardContent: { padding: 20 },
  location: { color: "#66757a", marginTop: 5 },
  details: { lineHeight: 1.6 },
  viewButton: { background: "#176477", color: "white", border: 0, padding: "12px 18px", borderRadius: 7, cursor: "pointer", fontWeight: 700 },
  backButton: { background: "white", color: "#154f5d", border: 0, borderRadius: 7, padding: "10px 16px", cursor: "pointer" },
  detailContainer: { maxWidth: 1100, margin: "0 auto", padding: "34px 20px 60px", textAlign: "center" },
  propertyTitle: { marginBottom: 5, fontSize: 36 },
  heroWrapper: { position: "relative", marginTop: 25, background: "#07151a", borderRadius: 12, overflow: "hidden" },
  heroImage: { width: "100%", height: 600, objectFit: "contain", display: "block" },
  arrow: { position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 2, width: 48, height: 48, borderRadius: "50%", border: 0, background: "rgba(0,0,0,.65)", color: "white", fontSize: 34, cursor: "pointer" },
  photoCounter: { color: "#425960", margin: "34px 0 22px" },
  thumbnailGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 14 },
  thumbnailButton: { background: "transparent", border: 0, padding: 0, cursor: "pointer" },
  thumbnail: { width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: "4px solid transparent", boxSizing: "border-box", display: "block" },
  calendarSection: { marginTop: 44, background: "white", padding: 28, borderRadius: 14, boxShadow: "0 5px 18px rgba(0,0,0,.08)" },
  calendarTitle: { marginTop: 0, fontSize: 34 },
  centerText: { textAlign: "center" },
  errorText: { color: "#c62828", textAlign: "center", fontWeight: 700 },
  calendarHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  monthButton: { width: 44, height: 44, borderRadius: "50%", border: 0, background: "#176477", color: "white", fontSize: 26, cursor: "pointer" },
  monthTitle: { margin: 0, fontSize: 24 },
  weekdayGrid: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 7, marginBottom: 7 },
  weekday: { fontWeight: 700, textAlign: "center" },
  calendarGrid: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 7 },
  blankDay: { minHeight: 58 },
  calendarDay: { minHeight: 58, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #d8d8d8", fontWeight: 700 },
  legend: { display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 20 },
  legendItem: { display: "inline-flex", alignItems: "center", gap: 8 },
  legendBox: { width: 18, height: 18, display: "inline-block", border: "1px solid #ccc", borderRadius: 4 },
  calendarNote: { color: "#6d777a", fontSize: 14, marginBottom: 0 },
  contact: { background: "#154f5d", color: "white", textAlign: "center", padding: "40px 20px" },
  contactButtons: { display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 22 },
  contactButton: { textDecoration: "none", color: "#154f5d", background: "white", padding: "12px 18px", borderRadius: 7, fontWeight: 700 },
};
