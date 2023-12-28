import { inject } from "vue";

export default () => {
  const showMessageBox = inject("showMessageBox");

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
  const $confirm = props => {
    return showMessageBox({
      ...props
    });
  };

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
  const $alert = props => {
    return showMessageBox({
      ...props,
      rejectButtonShow: false
    });
  };

  return {
    $confirm,
    $alert
  };
};
