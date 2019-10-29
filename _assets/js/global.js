//= require vendor/jquery-3.4.1.min
//= require vendor/bootstrap.bundle.min
//= require vendor/lazysizes.min

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/service_worker.js");
}
