const ClubList = (props) => {
  console.log("Displaying club list");
  return (
    <div>
      <ul style={{ listStyleType: "none" }}>
        {props.clubs.map((club) => (
          <li key={club._id} className="club-item">
            <h3 className="club-name">{club.clubName}</h3>
            <p className="club-category">Category: {club.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ClubList;
