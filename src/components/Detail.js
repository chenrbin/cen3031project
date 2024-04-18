import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Stack, Button, Typography } from "@mui/material";
import HumanIcon from "../assets/images/human_icon.png";
import CategoryIcon from "../assets/images/category_icon.png";
import CardImage from "../assets/images/cardholder.jpg";
import PropTypes from "prop-types";
import { handleRefresh } from "../API";
import axios from "axios";

const buttonStyle = {
  marginTop: "45px",
  textDecoration: "none",
  width: "200px",
  textAlign: "center",
  background: "#FF2625",
  padding: "12px",
  fontSize: "22px",
  textTransform: "none",
  color: "white",
  borderRadius: "4px",
  "&:hover": {
    color: "#FF2625",
    background: "#fff",
  },
};

const Detail = ({ clubDetail }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasClub, setHasClub] = useState(false);

  const { clubName, category, description, memberCount} = clubDetail;
  const { id } = useParams();

  Detail.propTypes = {
    clubDetail: PropTypes.shape({
      clubName: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      description: PropTypes.string,
      memberCount: PropTypes.number,
    }).isRequired,
  };

  
  const extraDetail = [
    {
      icon: HumanIcon,
      name: memberCount,
    },
    {
      icon: CategoryIcon,
      name: category,
    },
  ];
  async function addToList() {
    const response = await handleRefresh();
    console.log(response);
    if (response === 200) {
      console.log("Adding to list");
      await axios
        .post(
          "http://localhost:5000/user/add",
          { clubId: id },
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          checkLoginStatus();
        })
        .catch((error) => {
          console.log(error);
          if (response.status === 409) checkLoginStatus();
        });
    }
  }
  async function removeFromList() {
    const response = await handleRefresh();
    console.log(response);
    if (response === 200) {
      console.log("Deleting from list");
      await axios
        .post(
          "http://localhost:5000/user/remove",
          { clubId: id },
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response.data);
          checkLoginStatus();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  async function checkLoginStatus() {
    try {
      console.log(id);
      const response = await handleRefresh();
      console.log(response);
      if (response === 200) {
        setIsLoggedIn(true);
        await axios
          .get("http://localhost:5000/user/checkclub", {
            withCredentials: true,
            params: { id: id },
          })
          .then((response) => {
            console.log(response.data);
            setHasClub(response.data.exists);
          })
          .catch((error) => {
            setHasClub(false);
            console.log(error);
          });
      } else setIsLoggedIn(false);
    } catch (error) {
      setIsLoggedIn(false);
      console.log(isLoggedIn);
    }
  }
  useEffect(() => {
    checkLoginStatus();
  }, [isLoggedIn, setIsLoggedIn, id]);

  return (
    <Stack
      gap="60px"
      sx={{ flexDirection: { lg: "row" }, p: "20px", alignItems: "center" }}
    >
      <img
        src={CardImage}
        loading="lazy"
        className="detail-image"
        aria-labelledby="Gator Image"
      />
      <Stack sx={{ gap: { lg: "35px", xs: "20px" } }}>
        <Typography
          sx={{ fontSize: { lg: "64px", xs: "30px" } }}
          fontWeight={700}
          textTransform="capitalize"
        >
          {clubName}
        </Typography>
        <Typography
          sx={{ fontSize: { lg: "24px", xs: "18px" } }}
          color="#4F4C4C"
        >
          {description}
        </Typography>
        {extraDetail?.map((item) => (
          <Stack key={item.name} direction="row" gap="24px" alignItems="center">
            <Button
              sx={{
                background: "#FFF2DB",
                borderRadius: "50%",
                width: "100px",
                height: "100px",
              }}
            >
              <img
                src={item.icon}
                style={{ width: "50px", height: "50px" }}
                aria-labelledby="Gator Image"
              />
            </Button>
            <Typography
              textTransform="capitalize"
              sx={{ fontSize: { lg: "30px", xs: "20px" } }}
            >
              {item.name}
            </Typography>
          </Stack>
        ))}
        {isLoggedIn ? (
          <>
            {hasClub ? (
              <>
                <Button
                  variant="contained"
                  onClick={removeFromList}
                  sx={{
                    ...buttonStyle,
                    width: "230px",
                    display: "inline-block",
                  }}
                >
                  Delete from my list
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={addToList}
                  sx={{
                    ...buttonStyle,
                    width: "230px",
                    display: "inline-block",
                  }}
                >
                  Add to my list
                </Button>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </Stack>
    </Stack>
  );
};

export default Detail;
