import login from "../selectors/login.css";

describe("Login and Create Booking", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("http://dev.visitor.de:3000/login");
  });

  it("can login and create booking", function () {
    // Login
    cy.get(login.emailField).type("support@visitorapp.co");
    cy.get(login.passwordField).type("oJlF^Pza6Tzv");
    cy.get(login.signInButton).click();

    // Verify successful login
    cy.get(login.navBar)
      .should("be.visible")
      .within(() => {
        cy.contains("Welcome").should("be.visible");
      });

    // Navigate to booking creation
    cy.get('[data-testid="add-booking-btn"]').should("be.visible").click();

    // Click on February 3rd in the calendar
    cy.get('[data-testid="calendar-day-3-february-2025"]')
      .should("be.visible")
      .click();

    // Click on February 5th in the calendar
    cy.get('[data-testid="calendar-day-5-february-2025"]')
      .should("be.visible")
      .click();

    // Fill in customer name and select from dropdown
    cy.get('input[name="customer.fullName"]').should("be.visible").type("Raul");

    // Wait for the dropdown to load after typing
    cy.wait(3000); // Wait for the dropdown to load

    // Wait for and click the second autocomplete item
    cy.get('[data-testid^="autocomplete-item-"]') // Select elements with a data-testid that starts with "autocomplete-item-"
      .eq(1) // Select the second matching element (index 1)
      .should("be.visible") // Ensure the element is visible
      .click({ force: true }); // Force click to ensure the element is clicked
  });
});
