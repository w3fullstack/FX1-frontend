<template lang="pug">
.root
  //- .ticketcount-section.row
  //-   .container.token-container
  //-     .row.justify-between
  //-       .col.ticket-section
  //-         .frame
  //-           h1.token-h1 Your Ticket Count
  //-           p.token-p2.grey-text-2 2 Tickets per 1,000 $FX1
  //-         .action-button
  //-           .connect-wallet
  //-             .left
  //-               .token-p3 CONNECT WALLET
  //-             .right
  //-               img(:src="require(`~/assets/images/Jackpot/arrow-right.png`)")

  .ticketcount-section.row.win-chance
    .container.token-container
      .row.justify-between
        .col.ticket-count
          .coins
          //- .jackpot-box
          //-   .token-p3.grey-text Jackpot #2
          //-   .score-board
          //-     .score
          //-       .token-h2 11
          //-       .token-p3.grey-text OCT
          //-     .score
          //-       .token-h2 -
          //-       .token-p3.grey-text &nbsp
          //-     .score
          //-       .token-h2 10
          //-       .token-p3.grey-text NOV
          
          .jackpot-box-2
            .token-p3.grey-text Jackpot #3
            .score-board
              .score
                .token-h2 10
                .token-p3.grey-text NOV
              .score
                .token-h2 -
                .token-p3.grey-text &nbsp
              .score
                .token-h2 11
                .token-p3.grey-text DEC
                
          .token-p4 Increase your chances<br/>to win now!
          .margin-bottom-1
          .token-p.grey-text Don’t wait, entries close on 8th of November.
          .actions
            a.button.jackpot-button(
              href="https://app.uniswap.org/swap?outputCurrency=0xC5190E7FEC4d97a3a3b1aB42dfedac608e2d0793",
              target="_blank"
            ) Buy $FX1
            
        
</template>

<script>
export default {
  name: 'TicketCountSection',
}
</script>

<style lang="scss" scoped>
.win-chance {
  min-height: 70vh !important;
  @include max-width(650px) {
    min-height: 77vh !important;
  }
  @include max-width(389px) {
    min-height: 100vh !important;
  }
}
.ticketcount-section {
  padding: 150px 0px 0px 0px;
  position: relative;
  z-index: 99;

  @include max-width(650px) {
    padding-top: 100px;
  }

  .coins {
    position: absolute;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    overflow: hidden;
    z-index: 0;
    background-image: url('~assets/images/Jackpot/coins-group.png');
    height: 160%;
    top: -32%;
    left: 39%;
    zoom: 0.6;

    @include max-width(1650px) {
      left: 36%;
    }
    @include max-width(1340px) {
      left: 32%;
    }
    @include max-width(1210px) {
      top: -43%;
      left: 31%;
    }
    @include max-width(900px) {
      left: 26%;
    }
    @include max-width(650px) {
      left: 0%;
      top: -10%;
    }
  }

  .ticket-section {
    background-image: url('~assets/images/Jackpot/tc-back.png');
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
    backdrop-filter: blur(30px);
    width: 100%;
    height: 448px;
    padding: 72px, 371px, 72px, 60px;
    border-radius: 20px;
    border: 1px solid #00D8F9;
  }

  .token-p4 {
    font-size: 75px !important;
    font-weight: 400;
    line-height: 80px;
  }

  .frame {
    position: absolute;
    top: 72px;
    left: 60px;
  }

  .connect-wallet:hover {
    cursor: pointer;
  }

  .actions {
    margin: 50px 0 25px;

    .button {
      width: 235px;
      height: 82px;
      text-transform: uppercase;
    }
  }

  .action-button {
    position: absolute;
    width: 100%;
    top: 300px;
    left: 60px;

    .connect-wallet {
      padding: 24px 32px 24px 32px;
      border: 1px solid #FFFFFF;
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.10);
      backdrop-filter: blur(30px);
      box-shadow: 0px 1px 30px -5px rgba(227, 222, 255, 0.07) inset, 0px 4px 18px 0px rgba(146, 156, 210, 0.10) inset, 0px 98px 100px -48px rgba(170, 188, 204, 0.20) inset;
      height: 76px;
      width: 296px;
      display: inline-block;
      align-items: center;

      .right {
        img {
          margin-top: 4px;
          width: 25px !important;
        }
      }
    }
  }

  .token-h1 {
    -webkit-text-stroke: 0px;
    font-weight: 300 !important;
    text-shadow: none !important;
  }

  .token-h2 {
    font-weight: 500;
    color: white;
    font-size: 56px;
  }
  .row {
    align-items: center;
    @include max-width(500px) {
      flex-direction: column;
    }
  }
  
  .left {
    float: left !important;
    max-width: 100% !important;
  }

  .right {
    float: right !important;
    max-width: 100% !important;
  }

  .jackpot-box-2,
  .jackpot-box {
    top: 35%;
    right: 0%;
    position: absolute;
    width: 291px;
    height: 188px;
    padding: 16px 28px;
    align-items: center;
    text-align: center;
    border-radius: 12px;
    border: 1px solid #FFF;
    background: rgba(0, 0, 0, 0.01);
    box-shadow: 0px 1px 30px -5px rgba(227, 222, 255, 0.07) inset, 0px 4px 18px 0px rgba(146, 156, 210, 0.10) inset, 0px 98px 100px -48px rgba(170, 188, 204, 0.20) inset;
    backdrop-filter: blur(30px);
  }

  .jackpot-box-2 {
    margin-right: 15px;

    @include max-width(1210px) {
      top: 26%;
    }
    @include max-width(650px) {
      top: 56%;
      height: 150px !important;
      left: 0%;
      right: 0%;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .jackpot-box {
    right: 290px;
  }

  .score-board {
    margin-top: 20px;
    width: 100%;
    text-align: center;
    display: flex;

    .score {
      width: 33.33%;
    }
  }

  // RESPONSIVE

  @include max-width(1215px) {
    .token-p4 {
      font-size: 48px !important;
      line-height: 60px;
    }
  }
  @include max-width(650px) {
    .token-p4 {
      font-size: 36px !important;
      line-height: 40px;
    }
    .ticket-count {
      text-align: center;
    }
    .actions {
      margin-top: 50px !important;
    }
    .margin-bottom-1 {
      margin-bottom: 25px !important;
    }
  }
  @include max-width(430px) {
    .token-p4 {
      font-size: 28px !important;
    }
  }
}
</style>
