// Optional interaction: the complete workflow is readable without JavaScript.
const scene = document.querySelector('.scene');
const state = document.querySelector('.scene-state');
const buttons = [...document.querySelectorAll('.diagram-step')];
const descriptions = {
  build: 'Building: the light and script area are part of the scene you create.',
  play: 'Playtesting: follow the player’s route through the room and into the script area.',
  refine: 'Refining: select the light, adjust it, then try the scene again.',
};
if (scene && state && buttons.length) {
  buttons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      scene.dataset.stage = button.dataset.stage;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      state.textContent = descriptions[button.dataset.stage];
    });
  });
  state.hidden = false;
}
