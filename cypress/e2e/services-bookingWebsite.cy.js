import login from "../selectors/login.css";


describe("Booking Flow", () => {
  it("should complete booking", () => {

    cy.visit(
      "https://visitor-qa.visitor.de/?language=en-US&checkinDate=01-01-2026&checkoutDate=02-01-2026"
   );

    cy.contains('p', 'We are currently loading the availability for Visitor Hotel').should('be.visible');

    cy.contains('h4', 'Quadruple Room')
      .should('be.visible');

    cy.contains('h4', 'Double Room')
      .should('be.visible');

    cy.contains('h4', 'Apartment')
      .should('be.visible');

    cy.contains('h4', 'Triple Room')
      .should('be.visible');

    cy.contains('button', 'Show prices')
      .should('be.visible');
 
    cy.contains('span', '€199')
      .should('not.exist');

    cy.get('input[name="numberOfAdults"]').should("exist").clear().type("2");
    cy.get('input[name="numberOfChildren"]').should("exist").clear().type("0");

    cy.contains('button', 'Show prices')
      .should('not.exist');

    cy.contains('span', '€199')
      .should('be.visible');

    cy.get('[data-testid="next-step-btn"]')
    .scrollIntoView()
    .should('have.attr', 'disabled');  

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

    cy.get('[data-testid="next-step-btn"]')
      .scrollIntoView()
      .should('not.have.attr', 'disabled'); 
      
    cy.get('[data-testid="next-step-btn"]')
      .should("exist")
      .scrollIntoView()
      .click({ force: true });

    cy.get('input[name="firstName"]').should("exist").clear().type("Popescu");
    cy.get('input[name="lastName"]').should("exist").clear().type("Maria");
    cy.get('input[name="phoneNumber"]').should("exist").clear().type("0712345678");
    cy.get('input[name="email"]').should("exist").clear().type("maria@gmail.com");

    cy.get('span[style="text-transform: capitalize;"]')
      .eq(0)  
      .should('contain.text', '01 Jan 2026');

    cy.get('span[style="text-transform: capitalize;"]')
      .eq(1)  
      .should('contain.text', '02 Jan 2026');

    cy.get('input[id="roomBookings[0].numberOfAdults"]')
      .should("have.value", "2");

    cy.get('input[id="roomBookings[0].numberOfChildren"]')
      .should("have.value", "0");
              
    cy.get('h6.MuiTypography-root.MuiTypography-subtitle2')
       .should('contain.text', 'Double Room');

    cy.get('[data-testid="final-cost"] span')
      .should('contain.text', '199');

    cy.get('[id="roomBookings[0].numberOfAdults"]')
      .clear()
      .type('1');
            
    cy.get('[id="roomBookings[0].numberOfChildren"]')
      .clear()
      .type('1');

    cy.get('[id="roomBookings[0].childrenAges[0].age"]')
      .clear()
      .type('5');

    cy.get('[data-testid="final-cost"] span')
      .should('contain.text', '224');

    cy.contains('a', 'Make changes')
      .should('be.visible')
      .click();
              
    cy.get('input[placeholder="Number of adults"]')
      .should('have.value', '1');

    cy.get('input[placeholder="Number of children"]')
      .should('have.value', '1');
    
    cy.get('input[placeholder="Child 1 age"]')
      .should('have.value', '5');

    cy.get(`[data-testid="next-step-btn"]`)
      .should("exist")
      .scrollIntoView()
      .click({ force: true });

    cy.get('input[name="firstName"]').should("exist").clear().type("Popescu");
    cy.get('input[name="lastName"]').should("exist").clear().type("Maria");
    cy.get('input[name="phoneNumber"]').should("exist").clear().type("0712345678");
    cy.get('input[name="email"]').should("exist").clear().type("maria@gmail.com");

    cy.fillAddress();

    cy.get(`[data-testid="next-step-btn"]`)
      .should("exist")
      .scrollIntoView()
      .click({ force: true });

      cy.origin(
        "https://app.visitor.de",
        { args: { login } },  
        ({ login }) => {
          Cypress.require('../support/commands.js');

          cy.login(login);
        
          cy.visit(
            "/bookings?sortField=createdAt&sortDirection=DESC&includeDeletedBookings=true&fullSearch=maria"
          );
        
          cy.get('[data-testid="first-name"]').contains("Popescu Maria").first().click();
          cy.wait(10000);
        
          cy.get('.MuiBox-root.css-1nylpq2 span')
            .should('contain.text', '€224');
          
          cy.checkBookingInformation();
        }
      );
  

  });
})