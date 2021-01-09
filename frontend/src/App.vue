<template>
  <div id="app">
    <h1>Top Secret Content</h1>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data: () => ({
    devices: [],
  }),
  mounted() {
    const token = sessionStorage.getItem("token");
    console.log(token);
    axios
      .get("/api/devices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        console.log(data);
      });
  },
};
</script>

<style>
body {
  padding: 0;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
