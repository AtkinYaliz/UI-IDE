## Adapter Pattern
```
public class Cart {
	private List<Item> items;
	public void addItem(Item item) { items.add(item); }
}

public interface IItem {
	string getName();
	double getPrice();
	string getDepartment();
}
public class Banana : IItem {
	string getName() { return "Banana"; }
	double getPrice() { return 4.50; }
	string getDepartment() { return "Fruits"; }
}
public class Stapler : IItem {
	string getName() { return "Stapler"; }
	double getPrice() { return 5.00; }
	string getDepartment() { return "stationery"; }
}

public interface IProduct {
	string getName();
	double getPrice();
	Enum getStore();
}
public class Wheel : IProduct {
	string getName() { return "Wheel"; }
	double getPrice() { return 125.00; }
	Enum getStore() { return Stores.London; }
}

public class ProductAdapter : IItem {
	ProductAdapter(IProduct product) { _product = product; }

	string getName() { return _product.getName(); }
	double getPrice() { return_product.getPrice(); }
	string getDepartment() { return _product.getStore().ToString(); }
}

public static main() {
	var items = List<IItem>() {{
		add( new Banana() );
		add( new Stapler() );
		add( new ProductAdapter(new Wheel()) );
	}};
}
```

## Design patterns cheat sheet  
![Microservices Design Patterns](../examples/resources/microservices_design_patterns.png)  

![Design Patterns Cheat Sheet 1](../examples/resources/design_patterns_cheat_sheet_1.png)  
  
![Design Patterns Cheat Sheet 2](../examples/resources/design_patterns_cheat_sheet_2.png)
