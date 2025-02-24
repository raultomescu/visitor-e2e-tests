import login from "../selectors/login.css";

describe("Booking Flow", () => {
  it("should complete booking", () => {
    // Visit the specified URL
    cy.visit(
        "https://hotel-visitor-test.visitorapp.co/?language=en-US&checkinDate=01-01-2026&checkoutDate=02-01-2026"
     );
    // Select the number of adults and children
    cy.get('input[name="numberOfAdults"]').should("exist").clear().type("2");
    cy.get('input[name="numberOfChildren"]').should("exist").clear().type("0");

    // Wait for "0 Room(s)" to appear
    cy.contains("p", "0 Room(s)").should("be.visible"); 

    // Add a room
    cy.contains("h4", "Double Room")
      .should("exist")
      .then((doubleRoom) => {
        const h4TestId = doubleRoom.attr("data-testid");
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

            cy.get('input[id="roomBookings[0].numberOfAdults"]')
                .should("have.value", "2");

            cy.get('input[id="roomBookings[0].numberOfChildren"]')
                .should("have.value", "0");

            cy.get('[data-testid="final-cost"] span')
                .should('contain.text', '€189');

            cy.get(`[data-testid="next-step-btn"]`)
              .should("exist")
              .scrollIntoView()
              .click({ force: true });

            cy.wait(5000); 

          });
      });
  });

  it("should log in and verify booking details", () => {

    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("https://app.visitorapp.co/bookings?sortField=createdAt&sortDirection=DESC&includeDeletedBookings=true");

    cy.get(login.emailField).type("support+engineering@visitorapp.co");
    cy.get(login.passwordField).type("OTTAX2E421KA");
    cy.get(login.signInButton).click();

    cy.get(login.navBar)
      .should("be.visible")
      .within(() => {
        cy.contains("Welcome").should("be.visible");
      });

    cy.visit(
      "https://app.visitorapp.co/bookings?sortField=createdAt&sortDirection=DESC&includeDeletedBookings=true&fullSearch=maria"
    );

    cy.get('[data-testid="first-name"]').contains("Popescu Maria").first().click();

    cy.wait(2000);

    cy.get('.MuiBox-root.css-1nylpq2 span')
        .should('contain.text', '€189');
  });
})