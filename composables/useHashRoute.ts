import { watch, onMounted, Ref } from 'vue';

export function useHashRoute(ref: Ref<string>) {
  // Watch for changes in the ref and update the URL hash
  watch(ref, (newVal) => {
    window.location.hash = newVal;
  });

  // On component mount, set the ref to the current URL hash
  onMounted(() => {
    if (window.location.hash) {
      ref.value = window.location.hash.slice(1); // Remove the '#' character
    }
  });
}