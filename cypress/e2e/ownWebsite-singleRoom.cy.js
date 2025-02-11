import login from "../selectors/login.css";

describe("Booking Flow", () => {
  it("should complete booking", () => {
    // Visit the specified URL
    cy.visit(
      "https://visitor-qa.visitor.de/?language=en-US&checkinDate=01-01-2026&checkoutDate=02-01-2026"
    );

    // Select the number of adults and children
    cy.get('input[name="numberOfAdults"]').should("exist").clear().type("1");
    cy.get('input[name="numberOfChildren"]').should("exist").clear().type("2");
    cy.get('input[name="childrenAges[0].age"]')
      .should("exist")
      .clear()
      .type("5");
    cy.get('input[name="childrenAges[1].age"]')
      .should("exist")
      .clear()
      .type("7");

    // Wait for "0 Room(s)" to appear
    cy.contains("p", "0 Room(s)").should("be.visible");

    // Add a room
    cy.contains("h4", "Triple Room")
      .should("exist")
      .then((tripleRoom) => {
        const h4TestId = tripleRoom.attr("data-testid");
        const uuid = h4TestId.replace("id-", "");
        cy.get(`[data-testid="add-btn-${uuid}"]`)
          .should("exist")
          .scrollIntoView()
          .click({ force: true });
      });

    cy.get('input[name="firstName"]').should("exist").clear().type("Popescu");
    cy.get('input[name="lastName"]').should("exist").clear().type("Maria");
    cy.get('input[name="phoneNumber"]')
      .should("exist")
      .clear()
      .type("0712345678");
    cy.get('input[name="email"]')
      .should("exist")
      .clear()
      .type("maria@gmail.com");

    cy.get(`[data-testid="next-step-btn"]`)
      .should("exist")
      .scrollIntoView()
      .click({ force: true });

    // check the number of adults, number of children and the children ages
  });

  it("should log in and verify booking details", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("https://app.visitor.de/login");

    cy.get(login.emailField).type("support@visitorapp.co");
    cy.get(login.passwordField).type("oJlF^Pza6Tzv");
    cy.get(login.signInButton).click();

    cy.get(login.navBar)
      .should("be.visible")
      .within(() => {
        cy.contains("Welcome").should("be.visible");
      });

    cy.visit(
      "https://app.visitor.de/bookings?sortField=createdAt&sortDirection=DESC&includeDeletedBookings=true&fullSearch=maria"
    );

    cy.get('[data-testid="customer-name"]')
      .contains("Popescu Maria")
      .first()
      .click();

    cy.get('[data-testid="MoreVertIcon"]').click();

    cy.get('[data-testid="edit-btn"]').click();

    cy.get('input[id="roomBookings[0].numberOfAdults"]').should(
      "have.value",
      "1"
    );
    cy.get('input[id="roomBookings[0].numberOfChildren"]').should(
      "have.value",
      "2"
    );

    // check children ages
  });
});
