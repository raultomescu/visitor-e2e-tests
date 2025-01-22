describe("Date Picker Interaction", () => {
  it("can compare the final cost between pages", () => {
    // Visit the specified URL
    cy.visit(
      "https://visitor-qa.visitor.de/?language=en-US&checkinDate=06-01-2025&checkoutDate=07-01-2025"
    );

    // Select the number of adults
    cy.get('input[name="numberOfAdults"]').should("exist").clear().type("3");

    // Wait for "0 Room(s)" to appear
    cy.contains("p", "0 Room(s)").should("be.visible");

    // Check if there's an h4 with "Double Room"
    cy.contains("h4", "Double Room")
      .should("exist")
      .then((doubleRoom) => {
        // Get the uuid from the data-testid
        const h4TestId = doubleRoom.attr("data-testid");
        const uuid = h4TestId.replace("id-", ""); // Extract the full UUID

        // Scroll to and click the "add" button
        cy.get(`[data-testid="add-btn-${uuid}"]`)
          .should("exist")
          .scrollIntoView()
          .click({ force: true });
      });

    // Wait for the final cost to appear and store it in a variable
    cy.get('[data-testid="final-cost"]')
      .should("be.visible")
      .invoke("text")
      .then((initialFinalCost) => {
        const firstPageCost = initialFinalCost.trim(); // Store the cost from the first page

        // Click the "next step" button
        cy.get('[data-testid="next-step-btn"]')
          .should("exist")
          .scrollIntoView()
          .click({ force: true });

        // Wait for the final cost on the next page and compare
        cy.get('[data-testid="final-cost"]')
          .should("be.visible")
          .invoke("text")
          .then((nextPageFinalCost) => {
            const secondPageCost = nextPageFinalCost.trim(); // Store the cost from the next page

            // Compare the costs
            expect(firstPageCost).to.equal(secondPageCost);
          });
      });
  });
});
