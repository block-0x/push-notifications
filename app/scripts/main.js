  const applicationServerPublicKey = "BNjuSApoVDJAuZR-NHDT-8m-f7nX-0FeuEvjR5C8wZjOsoUUSknaOye8DamiO38OgbjyXramNkrCEp7WFMsPf5E";

  const pushButton = document.querySelector('.js-push-btn');

  let isSubscribed = false;
  let swRegistration = null;

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push is supported');

      navigator.serviceWorker.register('sw.js')
      .then(function(swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
      })
      .catch(function(error) {
        console.error('Service Worker Error', error);
      });
    } else {
      console.warn('Push messaging is not supported');
      pushButton.textContent = 'Push Not Supported';
    }

    function initialiseUI() {
      pushButton.addEventListener('click', function() {
        pushButton.disabled = true;
      if (isSubscribed) {
        unsubscribeUser();
      } else {
        subscribeUser();
      }
      });

      swRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        isSubscribed = !(subscription === null);

        if (isSubscribed) {
          console.log('User IS subscribed.');
        } else {
          console.log('User is NOT subscribed.');
        }

        updateBtn();
      });
    }

      navigator.serviceWorker.register('sw.js')
      .then(function(swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initialiseUI();
      })


    function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        isSubscribed = !(subscription === null);

        updateSubscriptionOnServer(subscription);

        if (isSubscribed) {
          console.log('User IS subscribed.');
        } else {
          console.log('User is NOT subscribed.');
        }

        updateBtn();
      });
    };


    function updateBtn() {
      if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
      }

      if (isSubscribed) {
        pushButton.textContent = 'Disable Push Messaging';
      } else {
        pushButton.textContent = 'Enable Push Messaging';
      }

      pushButton.disabled = false;
    }

      function unsubscribeUser() {
        swRegistration.pushManager.getSubscription()

        .then(function (subscription) {
          if (subscription) {
          return subscription.unsubscribe();
          }
        })

        .catch(function (error) {
          console.log('Error unsubscribing', error);
        })

        .then(function () {
          updateSubscriptionOnServer(null,true);
          console.log('User is unsubscribed.');
        isSubscribed = false;

        updateBtn();
        });
      }

      function subscribeUser() {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        })

        .then(function(subscription) {
          console.log('User is subscribed:', subscription);
          updateSubscriptionOnServer(subscription);
          isSubscribed = true;
          updateBtn();
        })

        .catch(function(err) {
          console.log('Failed to subscribe the user: ', err);
          updateBtn();
        });
      }

      function updateSubscriptionOnServer(subscription) {


        const subscriptionJson = document.querySelector('.js-subscription-json');
        const subscriptionDetails =
          document.querySelector('.js-subscription-details');

        if (subscription) {
          subscriptionJson.textContent = JSON.stringify(subscription);
          subscriptionDetails.classList.remove('is-invisible');
        } else {
          subscriptionDetails.classList.add('is-invisible');
        }
      }

    function postJson(jStr) {
        var http = new XMLHttpRequest();
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status == 200) {
                    console.log(http.responseText);
                } else {
                }
            } else {
            }
        }
        http.open('POST', './ajax.php', true);
      http.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    if (jStr){
      http.send('jsonStr=' + encodeURIComponent(jStr));
    } else {
      http.send('unset=true');
    }

    function unsubscribeUser() {
      swRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch(function(error) {
        console.log('Error unsubscribing', error);
      })
      .then(function() {
        updateSubscriptionOnServer(null);

        console.log('User is unsubscribed.');
        isSubscribed = false;

        updateBtn();
      });
      }
  }