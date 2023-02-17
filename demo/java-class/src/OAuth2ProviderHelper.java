package OAuth2ProviderHelper;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import picoded.core.web.RequestHttp;
import picoded.core.web.ResponseHttp;

/**
 * OAuth2ProviderHelper is a utility class used to simplify the integration of OAuth2 authentication with existing Java API servers.
 * It provides an easy way to authenticate users and get their identity, as well as to provide a secure authentication system.
 * 
 * This class helps facilitate the following flow between a client (via a browser), a server (the server program using this class), and a provider (such as Github or Google):
 * 
 * 1. The client sends a request to the server to initiate the OAuth 2.0 flow.
 * 2. The server responds by redirecting the client to the identity provider's authorization endpoint, including a unique authorization code.
 * 3. The client is redirected to the identity provider's login page, where the user is asked to log in and grant the client access.
 * 4. If the user grants access, the identity redirects the client to the server (redirectURL) with the authorization code.
 * 5. The client sends the authorization code to the server.
 * 6. The server exchanges the authorization code for an access token.
 * 7. The server uses the access token to get the client's unique identity.
 * 8. The server validates the identity and logs the user into the server application (outside the scope of this class).
 * 
 * This class provides the following public methods:
 * 
 * - getAuthorizationSessionUrl(): Returns the authorization session URL (String), used to redirect the user.
 * - getValidAccessToken(code): Returns a valid access token (String), requires the response code given to user when they are redirected back.
 * - getIdentity(token): Returns the identity of the user (String).
 * 
 * Any exceptions thrown by the class will be of type RuntimeException.
 */
public class OAuth2ProviderHelper {

	//
	// Properties
	//

	// oauth2 "/auth" endpoint, can include GET parameters
	private String authorizationURL;
	
	// Scope parameter to be passed with the authorization URL
	private String scope;
	
	// oauth2 "/token" endpoint, can include get parameters
	private String tokenURL;
	
	// redirect URL, to send the user back to, after authorization. This is used by the oauth2 provider, to redirect the user with a valid code after login.
	private String redirectURL;
	
	// oauth2 client ID, used together with the authorizationURL to redirect the user for login via the browser
	private String clientID;
	
	// oauth2 client secret, used to perform server to server communication with the oauth provider, to get the valid access token.
	private String clientSecret;
	
	// JSON API endpoint from the provider, to get the unique login ID (eg. email). This is used by the getIdentity method. And is called using a POST request.
	private String identityURL;
	
	// Property returned by the identityURL, for the unique login ID, defaults to "email"
	private String identityProperty;

	//
	// Constructor
	//

	/**
	 * Constructor for the OAuth2ProviderHelper class.
	 *
	 * @param params A map containing the following parameters:
	 *               - authorizationURL (String)
	 *               - scope (String)
	 *               - tokenURL (String)
	 *               - redirectURL (String)
	 *               - clientID (String)
	 *               - clientSecret (String)
	 *               - identityURL (String)
	 *               - identityProperty (String, optional)
	 */
	public OAuth2ProviderHelper(Map<String, Object> params) {
	    this.authorizationURL = params.get("authorizationURL").toString();
	    this.scope = params.get("scope").toString();
	    this.tokenURL = params.get("tokenURL").toString();
	    this.redirectURL = params.get("redirectURL").toString();
	    this.clientID = params.get("clientID").toString();
	    this.clientSecret = params.get("clientSecret").toString();
	    this.identityURL = params.get("identityURL").toString();
	    this.identityProperty = params.getOrDefault("identityProperty", "email").toString();
	}

	//
	// Method implementation
	//

	/**
	 * Returns the authorization session URL (String), this should be used to redirect the user.
	 *
	 * @return authorization session URL (String)
	 */
	public String getAuthorizationSessionUrl() {
	    return this.authorizationURL + "?client_id=" + this.clientID + "&redirect_uri=" + 
	        URLEncoder.encode(this.redirectURL, "UTF-8") + "&scope=" + this.scope;
	}

	/**
	 * Returns a valid access token as a String.
	 *
	 * @param code The authorization code given to the user when they are redirected back to the redirectURL
	 * @return A valid access token as a String
	 */
	public String getValidAccessToken(String code) {
	    Map<String, Object> reqParams = new HashMap<>();
	    reqParams.put("code", code);
	    reqParams.put("client_id", this.clientID);
	    reqParams.put("client_secret", this.clientSecret);
	    reqParams.put("redirect_uri", this.redirectURL);
	    HttpResponse response = RequestHttp.postJSON(this.tokenURL, reqParams);
	    if (response == null || response.toMap() == null || !response.toMap().containsKey("access_token")) {
	        throw new RuntimeException("Invalid response from tokenURL");
	    }
	    return (String) response.toMap().get("access_token");
	}

	/**
	 * Returns the identity of the user as a String.
	 *
	 * This method performs the request using the token with basic authentication.
	 * Headers can be set for RequestHttp, similar to the following example.
	 *
	 * <pre>
	 * {@code
	 * // Custom headers
	 * Map<String,Object> reqHeaders = new HashMap<String,Object>();
	 * reqHeaders.put("custom_header","c");
	 *
	 * // Request with cookie and header
	 * // note that any argument can be null, if the parameter is not needed
	 * HttpResponse response = RequestHttp.postJSON( requestURL, reqParams, reqCookie, reqHeaders );
	 * }
	 * </pre>
	 *
	 * @param token the access token
	 * @return the identity of the user as a String
	 */
	public String getIdentity(String token) {
	    Map<String, Object> reqHeaders = new HashMap<>();
	    reqHeaders.put("Authorization", "Bearer " + token);
	    return RequestHttp.postJSON(this.identityURL, null, null, reqHeaders).toMap().get(this.identityProperty).toString();
	}

}