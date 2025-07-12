import Vue from "vue";

const iconType = {
  scene: {
    icon: "mdi-web",
    color: "indigo",
  },
  namespace: {
    icon: "mdi-folder",
    color: "amber",
  },
  environment: {
    icon: "mdi-terrain",
    color: "green"
  },
  folder: {
    icon: "mdi-folder",
    color: "amber",
  },
  gridhelper: {
    icon: "mdi-grid",
    color: "",
  },
  arrowhelper: {
    icon: "mdi-axis-arrow",
    color: "",
  },
  transformcontrols: {
    icon: "mdi-axis-y-arrow",
    color: "",
  },
  control: {
    icon: "mdi-tune-variants",
    color: "",
  },
  directionallight: {
    icon: "mdi-weather-sunny",
    color: "yellow",
  },
  ambientlight: {
    icon: "mdi-weather-sunny",
    color: "yellow",
  },
  spotlight: {
    icon: "mdi-weather-sunny",
    color: "yellow",
  },
  pointlight: {
    icon: "mdi-weather-sunny",
    color: "yellow",
  },
  hemispherelight: {
    icon: "mdi-weather-sunny",
    color: "yellow",
  },
  group: {
    icon: "mdi-group",
    color: "light-green",
  },
  process: {
    icon: "mdi-cogs",
    color: "grey",
  },
  mesh: {
    icon: "mdi-triangle-outline",
    color: "green",
  },
  sprite: {
    icon: "mdi-texture",
    color: "grey",
  },
  bay: {
    icon: "mdi-transit-connection-variant",
    color: "blue",
  },
  object3d: {
    icon: "mdi-cube-outline",
    color: "primary",
  },
  object: {
    icon: "mdi-cube-outline",
    color: "primary",
  },
  material: {
    icon: "mdi-puzzle",
    color: "teal",
  },
  robot: {
    icon: "mdi-robot-industrial",
    color: "indigo",
  },
  line: {
    icon: "mdi-vector-line",
    color: "grey",
  },
  point: {
    icon: "mdi-circle-medium",
    color: "red",
  },
  factory: {
    icon: "mdi-factory",
    color: "teal",
  },
  joint: {
    icon: "mdi-vector-polyline",
    color: "cyan",
  },
  urdfjoint: {
    icon: "mdi-vector-polyline",
    color: "cyan",
  },
  link: {
    icon: "mdi-link",
    color: "cyan",
  },
  urdflink: {
    icon: "mdi-link",
    color: "cyan",
  },
  urdfrobot: {
    icon: "mdi-robot",
    color: "cyan",
  },
  urdfvisual: {
    icon: "mdi-panorama-sphere-outline",
    color: "cyan",
  },
  urdfmimicjoint: {
    icon: "mdi-arm-flex-outline",
    color: "cyan",
  },
  asset: {
    icon: "mdi-cube-outline",
    color: "primary",
  },
  part: {
    icon: "mdi-puzzle-outline",
    color: "yellow",
  },
  node: {
    icon: 'mdi-cellphone-wireless',
    color: 'light-blue'
  },
  data: {
    icon: 'mdi-database-outline',
    color: 'grey'
  },
  skybox: {
    icon: "mdi-weather-cloudy",
    color: "light-blue",
  },
  ground: {
    icon: "mdi-layers-outline",
    color: "light-green",
  },
  simulation: {
    icon: "mdi-play-box-multiple-outline",
    color: "deep-orange",
  },
  target: {
    icon: "mdi-target-variant",
    color: "brown",
  },
  effector: {
    icon: "mdi-adjust",
    color: "green",
  },
  operation: {
    icon: "mdi-lightning-bolt",
    color: "yellow",
  },
  function: {
    icon: "mdi-code-tags",
    color: "green",
  },
  orthographiccamera: {
    icon: "mdi-cctv",
    color: "blue-grey lighten-1"
  },
  perspectivecamera: {
    icon: "mdi-cctv",
    color: "blue-grey lighten-1"
  },
  rigidbody: {
    icon: 'mdi-vector-intersection',
    color: "yellow lighten-1"
  },
  amr: {
    icon: 'mdi-car',
    color: 'amber'
  },
  manipulator: {
    icon: 'mdi-robot-industrial',
    color: 'amber'
  },
  docker: {
    icon: 'mdi-docker',
    color: 'primary'
  },
  dockerfile: {
    icon: 'mdi-docker',
    color: 'primary'
  },
  json: {
    icon: 'mdi-code-json',
    color: 'yellow'
  },
  js: {
    icon: 'mdi-language-javascript',
    color: 'yellow'
  },
  py: {
    icon: 'mdi-language-python',
    color: 'teal'
  },
  txt: {
    icon: 'mdi-file-outline',
    color: 'white'
  },
  png: {
    icon: 'mdi-file-image-outline',
    color: 'green'
  },
  jpg: {
    icon: 'mdi-file-image-outline',
    color: 'green'
  },
  xml: {
    icon: 'mdi-xml',
    color: 'red'
  },
  zip: {
    icon: 'mdi-folder-zip-outline',
    color: 'light-green'
  },
  container: {
    icon: 'mdi-tray-full',
    color: 'light-green'
  },
  collider: {
    icon: 'mdi-set-center',
    color: 'red'
  },
  visual: {
    icon: 'mdi-shape-outline',
    color: 'teal'
  },
  stationmap: {
    icon: 'mdi-map-legend',
    color: 'green'
  },
  stationnode: {
    icon: 'mdi-circle-medium',
    color: 'light-green'
  },
  stationedge: {
    icon: 'mdi-transit-connection-horizontal',
    color: 'grey'
  },
  warehouse: {
    icon: 'mdi-warehouse',
    color: 'teal'
  },
  temperaturesensor: {
    icon: 'mdi-thermometer',
    color: 'orange'
  },
  humiditysensor: {
    icon: 'mdi-water-percent',
    color: 'blue'
  },
  lightsensor: {
    icon: 'mdi-lightbulb-variant-outline',
    color: 'amber'
  },
  gassensor: {
    icon: 'mdi-gas-cylinder',
    color: 'orange'
  },
  camera: {
    icon: 'mdi-video-outline',
    color: 'purple'
  },
  voltagesensor: {
    icon: 'mdi-flash',
    color: 'yellow'
  },
  currentsensor: {
    icon: 'mdi-current-dc',
    color: 'green'
  },
  flamesensor: {
    icon: 'mdi-fire',
    color: 'red'
  },

  // camera: {
  //   icon:'mdi-cctv',
  //   color: 'light-grey'
  // },
  tool: {
    icon: 'mdi-tools',
    color: 'teal'
  },
  origin: {
    icon: 'mdi-axis',
    color: 'grey'
  },
  undefined: {
    icon: 'mdi-file-question-outline',
    color: 'grey'
  },
  null: {
    icon: 'mdi-file-question-outline',
    color: 'grey'
  }
};

const levelColor = {
  0: "",
  1: "green",
  2: "yellow",
  3: " red",
};

const severity = {
  INFO: {
    color: 'grey',
    icon: 'mdi-information-outline'
  },
  WARN: {
    color: 'amber',
    icon: 'mdi-alert-outline'
  },
  ERROR: {
    color: 'error',
    icon: 'mdi-cancel'
  },
  CRITICAL: {
    color: 'indigo',
    icon: 'mdi-fire'
  }
};

const iconPack = {
  getIcon(type) {
    const T = type ? type.toLowerCase() : ''
    if (iconType[T]?.icon) {
      return iconType[T].icon
    } else {
      return 'mdi-file-question-outline'
    }
  },

  getColor(type) {
    const T = type ? type.toLowerCase() : ''
    if (iconType[T]?.color) {
      return iconType[T].color
    } else {
      return ''
    }
  },

  getAllIcons() {
    return [
      'mdi-home',
      'mdi-phone',
      'mdi-email',
      'mdi-account',
      'mdi-bell',
      'mdi-calendar',
      'mdi-chart-line',
      'mdi-check-circle',
      'mdi-alert',
      'mdi-cog',
      'mdi-folder',
      'mdi-file-document',
      'mdi-cloud',
      'mdi-earth',
      'mdi-link',
      'mdi-map-marker',
      'mdi-pin',
      'mdi-compass',
      'mdi-clock',
      'mdi-alarm',
      'mdi-timer',
      'mdi-check',
      'mdi-close',
      'mdi-heart',
      'mdi-star',
      'mdi-settings',
      'mdi-wifi',
      'mdi-bluetooth',
      'mdi-battery',
      'mdi-power',
      'mdi-speedometer',
      'mdi-gauge',
      'mdi-shield',
      'mdi-security',
      'mdi-lock',
      'mdi-lock-open',
      'mdi-key',
      'mdi-eye',
      'mdi-eye-off',
      'mdi-camera',
      'mdi-image',
      'mdi-map',
      'mdi-pin',
      'mdi-key',
      'mdi-clipboard',
      'mdi-download',
      'mdi-upload',
      'mdi-search',
      'mdi-magnify',
      'mdi-trash-can',
      'mdi-pencil',
      'mdi-book-open',
      'mdi-library',
      'mdi-school',
      'mdi-lightbulb',
      'mdi-flash',
      'mdi-fire',
      'mdi-water',
      'mdi-leaf',
      'mdi-tree',
      'mdi-flower',
      'mdi-music',
      'mdi-headphones',
      'mdi-microphone',
      'mdi-speaker',
      'mdi-gamepad',
      'mdi-controller',
      'mdi-trophy',
      'mdi-flag',
      'mdi-trophy-award',
      'mdi-lightbulb-on',
      'mdi-lightbulb-off',
      'mdi-chart-pie',
      'mdi-chart-bar',
      'mdi-chart-areaspline',
      'mdi-chart-donut',
      'mdi-calculator',
      'mdi-ruler',
      'mdi-compass',
      'mdi-briefcase',
      'mdi-wallet',
      'mdi-cash',
      'mdi-bank',
      'mdi-truck',
      'mdi-car',
      'mdi-bike',
      'mdi-airplane',
      'mdi-rocket',
      'mdi-puzzle',
      'mdi-cube',
      'mdi-hammer',
      'mdi-wrench',
      'mdi-screwdriver',
      'mdi-laptop',
      'mdi-desktop-tower',
      'mdi-server',
      'mdi-database',
      'mdi-wifi-strength-4',
      'mdi-chart-bubble',
      'mdi-chart-scatter-plot',
      'mdi-inbox',
      'mdi-clipboard-text',
      'mdi-checkbox-marked',
      'mdi-checkbox-blank-outline'
    ];
  }

}

Vue.prototype.$iconType = iconType;
Vue.prototype.$iconPack = iconPack;
Vue.prototype.$levelColor = levelColor;
Vue.prototype.$severity = severity;

export default ({ app }, inject) => {
  inject("iconType", iconType);
  inject("levelColor", levelColor);
  inject("severity", severity);
  inject("iconPack", iconPack);
};
