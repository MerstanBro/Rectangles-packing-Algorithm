# Rectangles Packing Algorithm

You can import the lengths and widths of the rectangles you want to pack using the check button. This will allow you to navigate all the possible widths and lengths that can be produced by those rectangles and the subsets of those rectangles.

## Rectangle Class Explanation

The `Rectangle` class represents a rectangle with certain properties and spatial relationships to other rectangles. Below is the detailed explanation of the class:

### JavaScript

```javascript
export class Rectangle {
  constructor(name, length, width, x, y) {
    this.name = name;
    this.length = length;
    this.width = width;
    this.x = x;
    this.y = y;
    this.below = null; // Initialize below as null
    this.right = null; // Initialize right as null
  }
}
```
### Properties:

- **name**: A string that identifies the rectangle.
- **length**: The length of the rectangle.
- **width**: The width of the rectangle.
- **x**: The x-coordinate of the top-left corner of the rectangle.
- **y**: The y-coordinate of the top-left corner of the rectangle.
- **below**: A reference to the rectangle that is immediately below this one. Initially set to `null`.
- **right**: A reference to the rectangle that is immediately to the right of this one. Initially set to `null`.

### Spatial Relationships:

- **right**: This property is used to find the rectangle that is directly adjacent to the right side of the current rectangle. The "right" rectangle starts at the top-right corner of the current rectangle.
- **below**: This property is used to find the rectangle that is directly below the current rectangle. The "below" rectangle starts at the bottom-left corner of the current rectangle.

In summary, the `Rectangle` class is designed to represent rectangles in a 2D space with additional properties (`right` and `below`) to navigate to adjacent rectangles based on their spatial arrangement.

## Why this Data Structure?

### Efficient Use of Space:

- The data structure ensures that every rectangle is placed in the next available position (`right` or `below`), optimizing the use of available space.
- This minimizes the amount of unused space, achieving a compact arrangement of rectangles.

### Minimized Redundancy:

- Since each rectangle is linked to its adjacent rectangles, the algorithm can efficiently navigate and place rectangles without recalculating positions, reducing computational redundancy.
- This leads to faster placement and better performance, especially when dealing with a large number of rectangles.

### Scalability:

- The structure is inherently scalable. New rectangles can be added by simply adjusting the `right` and `below` properties of existing rectangles.
- This allows for dynamic and flexible handling of rectangles, maintaining an optimized layout as the number of rectangles increases.


p.s the website looks like shit on mobile use a desktop 