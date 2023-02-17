---
type: java
name: OAuth2ProviderHelper
---
# OAuth2ProviderIntegration Class

OAuth2ProviderIntegration is used to simplify the integration of oauth2 for an existing java api servers, with an existing provider. This class provides an easy way to authenticate users and get their identity, as well as to provide a secure authentication system.

This helps facilitate the following flow between a client (via a browser), a server (the server program using this class), and a provider (such as github or google).

1. The client sends a request to the server to initiate the OAuth 2.0 flow.
2, The server responds by redirecting the client to the identity provider's authorization endpoint. This redirect includes a unique authorization code, which the identity provider uses to identify the client and the server.
3. The client is redirected to the identity provider's login page, where the user is asked to log in and grant the client access to the requested resources.
4. If the user grants access, the identity redirects the client to the server (redirectURL), which includes the authorization code.
5. The client sends the authorization code to the server,
6. The server exchanges the authorization code for an access token
7. The server uses the access token, to get the client unique identity
8. The server validate the identity, and logs the user into the server application (outside the scope of this class)

---

The following is the private string properties which is initialized by the constructor:
- authorizationURL : oauth2 "/auth" endpoint, can include GET parameters
- scope : Scope parameter to be passed with the authorization URL
- tokenURL : oauth2 "/token" endpoint, can include get parameters
- redirectURL : redirect URL, to send the user back to, after authorization. This is used by the oauth2 provider, to redirect the user with a valid code after login.
- clientID : oauth2 client ID, used together with the authorizationURL to redirect the user for login via the browser
- clientSecret : oauth2 client secret, used to perform server to server communication with the oauth provider, to get the valid access token.
- identityURL : JSON API endpoint from the provider, to get the unique login ID (eg. email). This is used by the getIdentity method. And is called using a POST request.
- identityProperty : Property returned by the identityURL, for the unique login ID, defaults to "email"

Public methods:
- getAuthorizationSessionUrl() : Returns the authorization session URL (String), this should be used to redirect the user.
- getValidAccessToken(code) : Returns a valid access token (String), requires the response code given to user when they are redirected back to redirectURL
- getIdentity(token) : Returns the identity of the user (String)

Implementation notes:

Any exceptions thrown by the class will be of type RuntimeException.

Import and use the 'picoded.core.web.RequestHttp' and 'picoded.core.web.ResponseHttp', for performing HTTP API request
The following is an example of how to use the RequestHttp API

```
// Perform a GET request
HttpResponse response = RequestHttp.get( requestURL );

// Alternatively a POST request as a JSON request, with parameters
Map<String,Object> requestParams = new HashMap<String,Object>();
requestParams.put("test","one");
response = RequestHttp.postJSON( requestURL, requestParams );

// Get the result string
String getResultString = response.toString();

// Or the response code
int statusCode = response.statusCode();

// Or a string object map
Map<String,Object> resultMap = response.toMap();
```

---

## Method Specific Specification

### constructor

The constructor accepts the following parameters, which would be provided in a java Map:
- authorizationURL (String)
- tokenURL (String)
- redirectURL (String)
- clientID (String)
- clientSecret (String)
- identityURL (String)
- identityProperty (String, optional)

### getAuthorizationSessionUrl

The getAuthorizationSessionUrl method returns a String containing the authorization session URL.

Implementation note: Do ensure to URI encode the redirectURL, when generating the session URL

You will need to handle both situations where the 'authorizationURL'
- contains a GET parameters (eg. http://example.com/oauth2/auth?param=something)
- contains no GET parameters (eg. http://example.com/oauth2/auth)

If the 'authorizationURL' is not a valid URL format, throw an error accordingly.

### getValidAccessToken

The getValidAccessToken method returns a valid access token as a String.

### getIdentity

The getIdentity method returns the identity of the user as a String.
For 'getIdentity', perform the request using the token with basic authentication. Headers can be set for RequestHttp, similar to the following example.

```
// Alternatively a POST request as a JSON request, with parameters
Map<String,Object> reqParams = new HashMap<String,Object>();
reqParams.put("test","one");

// Custom cookies
Map<String,Object> reqCookie = new HashMap<String,Object>();
reqCookie.put("cookie_a","b");

// Custom headers
Map<String,Object> reqHeaders = new HashMap<String,Object>();
reqHeaders.put("custom_header","c");

// Request with cookie and header
// note that any argument can be null, if the parameter is not needed
HttpResponse response = RequestHttp.postJSON( requestURL, reqParams, reqCookie, reqHeaders );
```
