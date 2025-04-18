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
    cy.get('input[name="childrenAges[0].age"]').should("exist").clear().type("5");
    cy.get('input[name="childrenAges[1].age"]').should("exist").clear().type("7");

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

    // Compare costs on different pages

    cy.get('[data-testid="final-cost"]')
      .should("be.visible")
      .invoke("text")
      .then((initialFinalCost) => {
        const firstPageCost = initialFinalCost.trim();

        cy.get('[data-testid="next-step-btn"]')
          .should("exist")
          .scrollIntoView()
          .click({ force: true });

        cy.get('[data-testid="final-cost"]')
          .should("be.visible")
          .invoke("text")
          .then((nextPageFinalCost) => {
            const secondPageCost = nextPageFinalCost.trim();
            expect(firstPageCost).to.equal(secondPageCost);
          

            cy.get('input[name="firstName"]').should("exist").clear().type("Popescu");
            cy.get('input[name="lastName"]').should("exist").clear().type("Maria");
            cy.get('input[name="phoneNumber"]').should("exist").clear().type("0712345678");
            cy.get('input[name="email"]').should("exist").clear().type("maria@gmail.com");

            cy.get('input[id="roomBookings[0].numberOfAdults"]').should("have.value", "1");

            cy.get('input[id="roomBookings[0].numberOfChildren"]').should("have.value", "2");

           // cy.wait(10000); 

            cy.get(`[data-testid="next-step-btn"]`)
              .should("exist")
              .scrollIntoView()
              .click({ force: true });

          });
      });
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

    cy.get('[data-testid="first-name"]').contains("Popescu Maria").first().click();

    cy.get('[data-testid="MoreVertIcon"]').click();

    cy.get('[data-testid="edit-btn"]').click();

    cy.get('input[name="customer.fullName"]').should("have.value", "Popescu Maria");

    cy.get('input[name="customer.email"]').should("have.value", "maria@gmail.com");

    cy.get('input[name="customer.phoneNumber"]').should("have.value", "0712345678");

    cy.get('#mui-component-select-bookingSource').should('contain.text', 'Website');

    cy.get('input[placeholder="DD/MM/YYYY"]').eq(0).should('have.value', '01/01/2026');

    cy.get('input[placeholder="DD/MM/YYYY"]').eq(1).should('have.value', '02/01/2026');

    cy.get('input[id="roomBookings[0].numberOfAdults"]').should("have.value", "1");

    cy.get('input[id="roomBookings[0].numberOfChildren"]').should("have.value", "2");

    cy.get('input[id="roomBookings[0].pricePerNight"]').should("have.value", "139");
  });
})