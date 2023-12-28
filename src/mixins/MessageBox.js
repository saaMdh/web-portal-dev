export default {
  inject: ["showMessageBox"],

  methods: {
    /**
     * Show a confirmation message box
     *
     * @param {object} props
     * @param {string} props.icon
     * @param {string} props.iconColor
     * @param {string} props.title
     * @param {string} props.message
     * @param {boolean} props.acceptButtonShow
     * @param {boolean} props.acceptButtonLabel
     * @param {boolean} props.rejectButtonShow
     * @param {boolean} props.rejectButtonLabel
     */
    $confirm(props) {
      return this.showMessageBox({
        ...props
      });
    },

    /**
     * Show a alert message box
     *
     * @param {object} props
     * @param {string} props.icon
     * @param {string} props.iconColor
     * @param {string} props.title
     * @param {string} props.message
     * @param {boolean} props.acceptButtonShow
     * @param {boolean} props.acceptButtonLabel
     * @param {boolean} props.rejectButtonShow
     * @param {boolean} props.rejectButtonLabel
     */
    $alert(props) {
      return this.showMessageBox({
        ...props,
        rejectButtonShow: false
      });
    }
  }
};
