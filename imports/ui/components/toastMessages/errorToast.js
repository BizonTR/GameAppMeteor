import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../toastMessages/errorToast.html';
import { Toast } from 'bootstrap/dist/js/bootstrap.bundle.min.js';

Template.errorToast.onCreated(function () {

});

Template.errorToast.helpers({
  errorMessage() {
    const errorMessage = Template.instance().data.errorMessage;
    return errorMessage; // Return the value of the reactive variable
  }
});

// Error message showing function
export const showToast = (instance, message) => {
  if (instance) {
    instance.errorMessage.set(message); // Set the message to the reactive variable
  } else {
    console.log("instance yok");
  }

  const toastElement = document.getElementById('customToast');
  const toast = new Toast(toastElement);
  toast.show();
};
