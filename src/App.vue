<template>
  <div
    @click="toggleDark"
    class="material-icons md-dark cursor-pointer m-2 text-lg"
  >
    {{ darkMode ? "light_mode" : "dark_mode" }}
  </div>
  <GameChart />
  <form
    action="https://www.paypal.com/donate"
    style="margin: 20px; float: right"
    method="post"
    target="_top"
  >
    <input type="hidden" name="hosted_button_id" value="XCT76DGPUL6AN" />
    <input
      type="image"
      src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif"
      border="0"
      name="submit"
      title="PayPal - The safer, easier way to pay online!"
      alt="Donate with PayPal button"
    />
    <img
      alt=""
      border="0"
      src="https://www.paypal.com/en_GB/i/scr/pixel.gif"
      width="1"
      height="1"
    />
  </form>
</template>

<script>
import { provide, ref, onMounted } from "vue";
import GameChart from "./components/GameChart.vue";
import "./index.css";

export default {
  components: {
    GameChart,
  },
  setup() {
    const darkMode = ref(false);

    provide("dark", darkMode);

    const toggleDark = () => {
      darkMode.value = !darkMode.value;
      document.querySelector("html").classList.toggle("dark");
      localStorage.setItem("darkMode", JSON.stringify(darkMode.value));
    };

    onMounted(() => {
      const localDark = JSON.parse(localStorage.getItem("darkMode"));
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      console.log(darkMode.value, localDark);
      if (localDark != null) {
        if (darkMode.value !== localDark) {
          toggleDark();
        }
      } else if (systemDark) {
        toggleDark();
      }
    });

    return { darkMode, toggleDark };
  },
};
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
