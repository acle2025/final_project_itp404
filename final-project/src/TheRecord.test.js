import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Products from "./routes/Products";
import ProductDetail from "./routes/ProductDetail";
import Favorite from "./routes/Favorite";
import Cart from "./routes/Cart";
import Account from "./routes/Account";

const mockProducts = [
    { id: 1, image: 'image1.png', name: 'T-shirt Front Design', price: 21 },
    { id: 2, image: 'image2.png', name: 'T-shirt Back Design', price: 21 },
    { id: 3, image: 'image3.png', name: 'Hoodie Design', price: 35 },
    { id: 4, image: 'image4.png', name: 'Tote Bag', price: 17 },
    { id: 5, image: 'image5.png', name: 'Poster', price: 17 },
    { id: 6, image: 'image6.png', name: 'Key Chain', price: 5 },
];

const renderWithRouter = (ui) => {
    return render(
        <MemoryRouter>{ui}</MemoryRouter>
    );
};

test('renders product list', () => {
    renderWithRouter(
        <Products products={mockProducts} />
    );

    const productNames = screen.getAllByRole('heading', { level: 5 });

    expect(productNames).toHaveLength(mockProducts.length);
    expect(productNames[0]).toHaveTextContent('T-shirt Front Design');
});

test('shows empty cart message', () => {
    renderWithRouter(
        <Cart userId={1} />
    );

    const message = screen.getByTestId('cart-empty-message');

    expect(message).toBeInTheDocument();
});

test('shows empty cart message', () => {
    renderWithRouter(
        <Cart userId={1} />
    );

    const message = screen.getByTestId('cart-empty-message');

    expect(message).toBeInTheDocument();
});

test('shows message when no favorites', () => {
    renderWithRouter(
        <Favorite userId={1} />
    );

    const message = screen.getByText(/you don't have any favorites yet/i);

    expect(message).toBeInTheDocument();
});

test('renders all product images', () => {
    renderWithRouter(
        <Products products={mockProducts} />
    );

    const images = screen.getAllByRole('img');

    expect(images).toHaveLength(mockProducts.length);
});

test('renders user details in the cart', () => {
    renderWithRouter(
        <Cart userId={1} />
    );

    const firstNameField = screen.getByTestId('first-name-input');

    expect(firstNameField).toBeInTheDocument();
    expect(firstNameField).toHaveValue('');
});

test('shows error when adding product to cart without size selection', () => {
    renderWithRouter(
        <ProductDetail userId={1} />
    );

    const addToCartButton = screen.findByTestId('add-to-cart-button');
    fireEvent.click(addToCartButton);
    const errorMessage = screen.getByText(/please select a size/i);

    expect(errorMessage).toBeInTheDocument();
});

test('removes product from cart successfully', () => {
    renderWithRouter(
        <Cart userId={1} />
    );

    const removeButton = screen.getByTestId(`remove-button-${1}`);
    fireEvent.click(removeButton);
    const emptyCartMessage = screen.getByText(/your cart is empty/i);
    
    expect(emptyCartMessage).toBeInTheDocument();
});

test('logs in successfully with valid credentials', () => {
    const mockSetUserId = jest.fn();
    renderWithRouter(<Account userId={userId} setUserId={mockSetUserId} />);

    fireEvent.change(screen.getByLabelText('Email', { selector: 'input[name="email"]' }), { target: { value: 'user@mail.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));


    expect(mockSetUserId).toHaveBeenCalledWith(expect.any(Number));
});


test('decrements product quantity but not below 1', () => {
    renderWithRouter(
        <ProductDetail userId={1} />
    );

    const decrementButton = screen.getByTestId('decrement-button');
    fireEvent.click(decrementButton);
    const quantity = screen.getByText('1');

    expect(quantity).toBeInTheDocument();
});
