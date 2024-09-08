import { useState, useEffect, useCallback } from 'react';

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message || 'Something went wrong, failed to send request'
    );
  }

  return responseData;
}

export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  function clearData() {
    setData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      try {
        const responseData = await sendHttpRequest(url, {
          ...config,
          body: data
        });
        setData(responseData);
      } catch (error) {
        setError(error.message || 'Something went wrong!');
      }
      setIsLoading(false);
    },
    [url, config]
  );

  useEffect(() => {
    if (config && (config.method === 'GET' || !config.method || !config)) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData
  };
}

// sendHttpRequest() helper function is for in general dealing
// with sending requests

// useHttp() hook will be about updating some state based on the
// request status.

// should wrap sendRequest async function with useCallback(),
// and add our dependencies array here. and we get back a
// sendRequest() function here from useCallback, which will now
// only be recreated when it's dependencies change[url, config].
// in sendRequest function, we actually need to pass some data
// to sendHttpRequest() to configure it correctly b/c
// sendHttpRequest, at least needs a url potentially needs
// a config object. Therefore our custom hook should get that url,
// and  that config object. and now we can forward url and config
// to sendHttpRequest
//  const sendRequest = useCallback(
//   async function sendRequest() {
//     setIsLoading(true);
//     try {
//       const responseData = sendHttpRequest(url, config);
//       setData(responseData);
//     } catch (error) {
//       setError(error.message || 'Something went wrong!');
//     }
//     setIsLoading(false);
//   },
//   [url, config]
// );

// we therefore have to add both to useCallback dependencies.
// b/c if one of thes two would change, we would need to create
// a new function object, b/c the code in there would change
// after all sendHttpRequest would be called with different data
// but with that we can now use sendRequest here in useEffect
//   useEffect(() => {
//     sendRequest();
// }, [sendRequest]);
// whenever the component that uses this hook here loads
// whilst that is what we want for the meals component,
// it's of course not what we want for Checkout component.

// therefore here in this useEffect function, in the custom
// hook. we also should add some check that makes sure that
// sendRequest is not always getting sent. one check we do is
// we take a look at that config object which we're getting
// as an input to our custom hook. and there we take a look
// at the request method. and if it's get, or if no config obj
// was provided in the first place. we wanna send the request
// right away. b/c here in this app, every 'GET' request should
// be sent when component to which the hook here belongs gets
// rendered. if the request method is something else, i don't
// wanna send the request. so here i check if config is truthy,
// if it's set at all, and if it is set, if the method is
// equal to 'GET', in that case we wanna execute sendRequest(),
// otherwise we won't do anything. Now, of course config must be
// added as a dependency here
// useEffect(() => {
//   if (config && config.method === 'GET') {
//     sendRequest();
//   }
// }, [sendRequest,  config]);
// b/c i'm using it here, but with that we whould now be
// making sure that this request is only sent if we have some kind
// of 'GET' request, and for those other request i wanna expose
// sendRequest here, but putting it in the returon object by
// the custom hook. so other components that use the hook
// can get direct access to the sendRequest whenever they want,
// such as when a form is submitted

// now we can go to Meals and Checkout components and replace the
// useEffect hook with the custom hook we just build
//

// at first isLoading will be false, so when the meals component tries
// to render it will error out, because it is only set to true
// once the useEffect is called in which turn calls the sendRequest
// once the component mounts. but since it is called after the
// component mounts, it's still isLoading false, resulting in error.

// to fix this we can pass a third arg to useHttp, initialData
// which is the initialData we want to set to that data state in
// our custom hook. b/c this now allows us to go to the meals
// component. and there to useHttp and maybe pass an empty obj
// {} for the configuratin, but then pass an empty array of
// meals as initial data for the loadedMeals
