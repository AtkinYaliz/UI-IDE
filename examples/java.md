### OAuth 2.0: 
- Stands for "Open Authorization", is a standard designed to allow an application to access resources hosted by another application on behalf of a user.
- It is an authorization protocol not an authentication protocol.
- Designed for granting access to a set of resources, eg. remote API or user's data.
- OAuth 2.0 uses Access Token

__Roles:__
- __Resource Owner:__ The user or system that owns the protected resources and can grant access to them.
- __Client:__ The system that requires access to the protected resources. To access resources, the Client must hold an appropriate Access Token.
- __Resource Server:__ A server that protects the user's resources and receives access requests from the Client. It accepts and validates an Access Token from the Client and returns the appropriate resources to it.
- __Authorization Server:__ A server that receives requests from the Client for Access Tokens and issues them upon successful authentication and consent by the Resource Owner.



### Java basics
```
// Arrays
int[] arr = new int[3];
int[] arr = {1, 2, 3};
int[] arr = new int[] {1, 2, 3};

// Collections
List<String> values = Collections.emptyList();    // Creates an immutable list.
List<String> values = new ArrayList<String>();
List<String> values = List.of( "One", "Two" );
List<String> values = Arrays.asList( "apple", "banana" );

Set<String> values = Set.of( "One", "Two" );                   // Returns an unmodifiable map
Map<Integer, String> values = Map.of( 1, "One", 2, "Two" );    // Returns an unmodifiable map
Map<Integer, String> values = Map.ofEntries(                   // Returns an unmodifiable map
    Map.entry(1, "One"),
    Map.entry(2, "Two")
);
Map<Integer, String> values = new HashMap<>( 
    Map.of(1, "One", 2, "Two", 3, "Three")
);


// Streams
var stream = InStream.range(1, 10);
var stream = Arrays.stream( new int[]{1,2,3} );
var stream = Stream.of( 1, 2, 3 );
var stream = Stream.of( List.of("One", "Two") );
var stream = list.stream();

String[] arr = stream.toArray( String[]::new );
List<String> list = stream.collect( Collectors.toList() );
Set<String> set = stream.collect( Collectors.toSet() );
String str = stream.collect( Collectors.joining(", ") );
  stream.map(w -> w.toLowerCase());
  stream.map(String::toLowerCase);

// Serialization
Car car = new Car() {{ setColor("Red"); setType("BMW"); }};
String json1 = "{ 'color': 'Black', 'type': 'BMW' }";
String json2 = "{ \"color\" : \"Black\", \"type\" : \"BMW\" }";
String json3 = "[{ \"color\" : \"Black\", \"type\" : \"BMW\" }, { \"color\" : \"Red\", \"type\" : \"FIAT\" }]";

// JSON (JSONObject - parse from unknown string)
JSONObject jo1 = new JSONObject( json1 );
JSONObject jo2 = new JSONObject( json2 );
JSONObject jo3 = new JSONArray( json3 );

JSONObject joCity = new JSONObject();
jo.put( "name", "london" );
jo1.put( "city", joCity );
println( jo1.getJSONObject("city').get("name") );

// JSON (com.fasterxml.jackson.core)
ObjectMapper objectMapper = new ObjectMapper();
String s = objectMapper.writeValueAsString( car );
MyClass m = objectMapper.readValue(s, MyClass.class);
List<Car> listCar = objectMapper.readValue( json3, new TypeReference<List<Car>>(){} );

// JSON (com.google.code.gson)
var gson = new Gson();
String s = gson.toJson( car );
MyClass m = gson.fromJson( s, MyClass.class );


var applicationScope = scopeService.getScopes(individualDetails).stream()
                .map(scope -> String.format("%s_%s", tenantDomainName, loginAppId))
                .collect(Collectors.joining(" "));

// Lambda Expression
@FunctionalInterface // (SAM = single abstract method)
interface Printable {
    // Abstract method (no body)
    String print(int i);
}
class Cat implements Printable { String print(int i) { return i.toString(); } }
static void printThing(Printale p) {
	p.print(3);
}
//MyMath m = a -> a*2;
//int result = m.getDouble(45);


printThing( new Cat() );
printThing(
	public String print(int i) { return i.toString(); }
);
printThing(
	(int i) -> { return i.toString(); }
);

Printable p = (i) -> { return i.toString(); }
printThing( p );

// Method Expressions
System.out::println      x -> System.out.println(x)
String[]::new            (int x) -> new String(x)
Double::new              x -> new Double(x)
String::toUpperCase      (String x) -> x.toUpperCase()
```

### HttpStatus.java (enum)
```
public enum HttpStatus {
    CREATED(201, HttpStatus.Series.SUCCESSFUL, "Created"),
    ACCEPTED(202, HttpStatus.Series.SUCCESSFUL, "Accepted");

    private final int value;
    private final HttpStatus.Series series;
    private final String reasonPhrase;

    private HttpStatus(int value, HttpStatus.Series series, String reasonPhrase) {
        this.value = value;
        this.series = series;
        this.reasonPhrase = reasonPhrase;
    }

    public int value() {
        return this.value;
    }
    public String toString() {
        return this.value + " " + this.name();
    }
}
```

### RestTemplate
```
HttpHeaders headers = new HttpHeaders();
headers.set("X-Callsign-ApiKey", callsignApikey);

PayloadUser body = new PayloadUser();

#1
User userResponse = restTemplate.getForObject(url, User.class, headers);
User userResponse = restTemplate.postForObject(url, new HttpEntity<>(body, headers), User.class);

ResponseEntity<User> response = restTemplate.getForEntity(url, User.class); // no headers
ResponseEntity<User> response = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), User.class);
HttpStatus status = response2.getStatusCode();
String restCall = response2.getBody();

#3
ResponseEntity<User> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), User.class);
ResponseEntity<User> response = restTemplate.exchange(url, HttpMethod.PUT, new HttpEntity<>(body, headers), User.class);


#4
RequestEntity<User> requestEntity = RequestEntity.method(HttpMethod.POST, url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(userCredentials);
ResponseEntity<User> response = restTemplate.exchange(requestEntity, User.class);
```


