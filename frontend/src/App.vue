<template>
  <div id="app">
    <h1 style="text-align: center">Top Secret Content</h1>
    <div class="devices">
      <div v-for="device in devices" :key="device.id" class="device">
        <span style="font-weight: bold">{{ device.name }}</span>
        <div class="parameters">
          <span>id: {{ device.id }}</span>
          <span>Typ controlera: {{ device.controllerType }}</span>
          <span>Typ urządzenia: {{ device.type }}</span>
          <span>Stan: {{ device.enabled ? "On" : "Off" }}</span>

          <span v-if="device.type != 'sensor'"
            >Moc naświetlenia: {{ device.duty }}</span
          >
        </div>
      </div>
    </div>
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
    axios
      .get("/api/devices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        console.log(data);
        this.devices = data;
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

.devices {
  margin-top: 8%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.devices .device {
  margin: 10px 0;
  background: rgb(245, 245, 245);
  padding: 15px;
  width: 190px;
  height: 190px;
  border: 1px solid #333;
}

.devices .device .parameters {
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
