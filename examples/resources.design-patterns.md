## Factory Method Pattern - Creational

This example defines an interface _IShape_ and two classes _Circle_ and _Square_ that implement the interface. The _ShapeFactory_ class acts as the factory and returns an instance of _Circle_ or _Square_ based on the input string. The Main method creates an instance of _ShapeFactory_ and uses it to create two shapes and draw them.


The factory method pattern and the abstract factory pattern are both creational design patterns that provide a way to create objects without specifying the exact class of object that will be created. However, there are some key differences between the two patterns:

Purpose: The factory method pattern is used to create objects of a single class, while the abstract factory pattern is used to create objects of multiple related classes.

Structure: The factory method pattern has a single factory class with one or more factory methods, each of which returns an instance of a single class. The abstract factory pattern has an abstract factory class that acts as an interface for creating objects of multiple related classes, and concrete factory classes that implement the abstract factory class and create objects of the related classes.

Flexibility: The factory method pattern is more flexible than the abstract factory pattern because it can be easily extended to create objects of different classes by simply adding new factory methods. The abstract factory pattern requires a complete new concrete factory class to be created in order to support a new type of object.

In summary, the factory method pattern is useful when you need to create objects of a single class and want to encapsulate the object creation process, while the abstract factory pattern is useful when you need to create objects of multiple related classes and want to enforce a set of relationships between them.

```
public interface IShape
{
    void Draw();
}

public class Circle : IShape
{
    public void Draw()
    {
        Console.WriteLine("Drawing a Circle");
    }
}

public class Square : IShape
{
    public void Draw()
    {
        Console.WriteLine("Drawing a Square");
    }
}

public class ShapeFactory
{
    public IShape GetShape(string shapeType)
    {
        if (shapeType == null)
        {
            return null;
        }

        if (shapeType.Equals("Circle"))
        {
            return new Circle();
        }
        else if (shapeType.Equals("Square"))
        {
            return new Square();
        }

        return null;
    }
}

class Program
{
    static void Main(string[] args)
    {
        ShapeFactory shapeFactory = new ShapeFactory();

        IShape shape1 = shapeFactory.GetShape("Circle");
        shape1.Draw();

        IShape shape2 = shapeFactory.GetShape("Square");
        shape2.Draw();
    }
}
```

## Adapter (Wrapper) Pattern - Structural [Wiki](https://en.wikipedia.org/wiki/Adapter_pattern)

In software engineering, the adapter pattern is a software design pattern (also known as wrapper, an alternative naming shared with the decorator pattern) that allows the interface of an existing class to be used as another interface. It is often used to make existing classes work with others without modifying their source code.

The adapter design pattern solves problems like:
- How can a class be reused that does not have an interface that a client requires?
- How can classes that have incompatible interfaces work together?
- How can an alternative interface be provided for a class?

Often an (already existing) class can't be reused only because its interface doesn't conform to the interface clients require.
The adapter design pattern describes how to solve such problems:
- Define a separate adapter class that converts the (incompatible) interface of a class (adaptee) into another interface (target) clients require.
- Work through an adapter to work with (reuse) classes that do not have the required interface.

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

## Blogs
- [Flutter Design Patterns](https://kazlauskas.dev/flutter-design-patterns-0-introduction)

## Byte Byte Go

|ssdf|ddd|
|---|---|
|ddd|eeeee|

## Design patterns cheat sheet  
![Microservices Design Patterns](../examples/resources/microservices_design_patterns.png)  

![Design Patterns Cheat Sheet 1](../examples/resources/design_patterns_cheat_sheet_1.png)  
  
![Design Patterns Cheat Sheet 2](../examples/resources/design_patterns_cheat_sheet_2.png)
