import axios from "axios";

const apiUrl = "https://israelpost.co.il/umbraco/Surface/Zip/FindZip";

const requestBody = {
  name: "John Doe",
  email: "johndoe@example.com",
};

axios
  .post(apiUrl, requestBody)
  .then((response: { data: any }) => {
    // Handle the response here
    console.log(response.data);
  })
  .catch((error: any) => {
    // Handle any errors here
    console.error(error);
  });
