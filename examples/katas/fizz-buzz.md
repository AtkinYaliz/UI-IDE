
Write a program that prints the numbers from 1 to 100. But for multiples of three print "_Fizz_" instead of the number and for the multiples of five print "_Buzz_".  
For numbers which are multiples of both three and five print "_FizzBuzz_".

```
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
17
Fizz
19
Buzz
```

__Stage 2 - new requirements__  
A number is _Four_ if it has a 4 in it  
A number is _Nine_ if it has a 9 in it  

For exemple:  
49 should return _FourNine_ (contains 4 and 9)  
45 should return _FizzBuzzFour_ (divisible by both 3 and 5, and contains 4)  

```
import java.util.ArrayList;

public class FizzBuzz {

    private ArrayList<FizzBuzzFilter> filters = new ArrayList<FizzBuzzFilter>();

    public Object[] filter(int[] integers) {
        Object[] result = new Object[integers.length];
        for (int i = 0; i < integers.length; i++) {
            result[i] = convert(integers[i]);
        }
        return result;
    }

    private Object convert(int integer) {
        String converted = applyFilters(integer);
        return "".equals(converted) ? integer : converted;
    }

    private String applyFilters(int integer) {
        String converted = "";
        for (FizzBuzzFilter filter : filters) {
            converted += filter.filter(integer);
        }
        return converted;
    }

    public void addFilter(FizzBuzzFilter fizzBuzzFilter) {
        filters.add(fizzBuzzFilter);
    }
}
```
