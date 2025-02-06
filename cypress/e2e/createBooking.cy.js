import login from "../selectors/login.css";

describe("Login and Create Booking", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("https://app.visitor.de/login");
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
    cy.get('[data-testid="calendar-day-13-march-2025"]')
      .should("be.visible")
      .click();

    // Click on February 5th in the calendar
    cy.get('[data-testid="calendar-day-15-march-2025"]')
      .should("be.visible")
      .click();

    // Fill in customer name and select from dropdown
    cy.get('input[name="customer.fullName"]')
      .should("be.visible")
      .type("Raul ");

    // Wait for the dropdown to load after typing
    cy.wait(3000); // Wait for the dropdown to load

    // Wait for and click the second autocomplete item
    cy.get('[data-testid^="autocomplete-item-"]') // Select elements with a data-testid that starts with "autocomplete-item-"
      .eq(1) // Select the second matching element (index 1)
      .should("be.visible") // Ensure the element is visible
      .click({ force: true }); // Force click to ensure the element is clicked

    // Select room
    cy.get("#mui-component-select-_roomBookings")
      .first()
      .should("be.visible")
      .click({ force: true });

    cy.wait(3000); // Wait for the dropdown to load

    cy.get('[role="listbox"]')
      .should("be.visible")
      .should("have.length.gt", 0)
      .within(() => {
        // here add what rooms you want to chose from the dropdown
        // maybe in the future add a function to select first available room
        cy.contains("Room 1").should("be.visible").click({ force: true });
        cy.contains("Room 2").should("be.visible").click({ force: true });

        cy.get('[data-testid="save-btn"]')
          .should("be.visible")
          .and("be.enabled")
          .click({ force: true });
      });

    // Verify booking creation

    cy.get('input[name*="roomBookings"][name*="pricePerNight"]')
      .should("have.length.gt", 0)
      .each(($priceInput, index) => {
        // Verify price
        const price = parseFloat($priceInput.val());
        expect(price).to.be.greaterThan(0);
        cy.log(`Room ${index + 1} price per night: €${price}`);

        // Verify adults
        cy.get(`input[name="roomBookings[${index}].numberOfAdults"]`)
          .should("be.visible")
          .then(($adultsInput) => {
            const adults = parseInt($adultsInput.val());
            expect(adults).to.be.within(1, 4);
            cy.log(`Room ${index + 1} adults: ${adults}`);
          });

        // Verify children
        cy.get(`input[name="roomBookings[${index}].numberOfChildren"]`)
          .should("be.visible")
          .then(($childrenInput) => {
            const children = parseInt($childrenInput.val());
            expect(children).to.be.at.least(0);
            cy.log(`Room ${index + 1} children: ${children}`);
          });
      });
  });
});
