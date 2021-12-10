---
layout: post
title: The Cryptopunks V1 Hack
author: [Achim]
date: 2021-12-10T09:40:32.169Z
draft: true
permalink: 'cryptopunk-bug'
category: 'Coding'
tags:
  - 'Solidity'
  - 'ink'
  - 'Rust'
excerpt: 'I show how to set up a react library which I publish to Github, so I can import it into a React project as a dependency. There is a powerful tool which allows to do a boilerplate approach to build a library: create-react-library.'
image: 'img/library.jpg'
---

I want to discuss here an important [Solidity](https://en.wikipedia.org/wiki/Solidity) [Smart Contract](https://en.wikipedia.org/wiki/Smart_contract) exploit. I wand to give some understanding, how it opccured and to which extent another Smart Contract Language, [ink!](https://github.com/paritytech/ink) by Parity Technologies would prevent such a bug by its inherent design principles.

I focus on the Cryptopunks V1 exploit. [Cryptopunks](https://www.larvalabs.com/cryptopunks) are a series of NFT collectibles of some [real economic value](https://news.artnet.com/market/visa-purchased-first-cryptopunk-kickstarting-record-run-sales-popular-series-nfts-2002289).

The Smart Contract code that I discuss here takes charge of the accounting of ownership of the NFTs. After a first security audit and its release, it turned out, that the Smart Contract carries a [highly problematic exploit](https://blog.quillhash.com/2021/08/11/nft-smart-contract-exploits-that-made-headlines-in-the-past/#CryptoPunks).

It was just after all NFTs had been minted and the secondary marked kicked off that sellers realized, that they didn't receive the funds, buyers paid for their NFTs. Indeed, the buyers were possible to buy and pay an NFT, refund their paid amount and use the refund to buy the next NFT. The only possivble resolution was the instantiation of Cryptopunks V2, while V1 punks continued to exist.

To gain a better understanding of the exploit, I state the [Source Code](https://github.com/cryptopunksnotdead/punks.contracts/blob/master/punks-v1/CryptoPunks.sol) of the Cryptopunks V1 Smart Contract here:

```javascript{numberLines:0}
pragma solidity ^0.4.8;
contract CryptoPunks {

    // You can use this hash to verify the image file containing all the punks
    string public imageHash = "ac39af4793119ee46bbff351d8cb6b5f23da60222126add4268e261199a2921b";

    address owner;

    string public standard = 'CryptoPunks';
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    uint public nextPunkIndexToAssign = 0;

    //bool public allPunksAssigned = false;
    uint public punksRemainingToAssign = 0;
    uint public numberOfPunksToReserve;
    uint public numberOfPunksReserved = 0;

    //mapping (address => uint) public addressToPunkIndex;
    mapping (uint => address) public punkIndexToAddress;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;

    struct Offer {
        bool isForSale;
        uint punkIndex;
        address seller;
        uint minValue;          // in ether
        address onlySellTo;     // specify to sell only to a specific person
    }

    // A record of punks that are offered for sale at a specific minimum value, and perhaps to a specific person
    mapping (uint => Offer) public punksOfferedForSale;

    mapping (address => uint) public pendingWithdrawals;

    event Assign(address indexed to, uint256 punkIndex);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event PunkTransfer(address indexed from, address indexed to, uint256 punkIndex);
    event PunkOffered(uint indexed punkIndex, uint minValue, address indexed toAddress);
    event PunkBought(uint indexed punkIndex, uint value, address indexed fromAddress, address indexed toAddress);
    event PunkNoLongerForSale(uint indexed punkIndex);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function CryptoPunks() payable {
        //        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        owner = msg.sender;
        totalSupply = 10000;                        // Update total supply
        punksRemainingToAssign = totalSupply;
        numberOfPunksToReserve = 1000;
        name = "CRYPTOPUNKS";                                   // Set the name for display purposes
        symbol = "Ͼ";                               // Set the symbol for display purposes
        decimals = 0;                                       // Amount of decimals for display purposes
    }

    function reservePunksForOwner(uint maxForThisRun) {
        if (msg.sender != owner) throw;
        if (numberOfPunksReserved >= numberOfPunksToReserve) throw;
        uint numberPunksReservedThisRun = 0;
        while (numberOfPunksReserved < numberOfPunksToReserve && numberPunksReservedThisRun < maxForThisRun) {
            punkIndexToAddress[nextPunkIndexToAssign] = msg.sender;
            Assign(msg.sender, nextPunkIndexToAssign);
            numberPunksReservedThisRun++;
            nextPunkIndexToAssign++;
        }
        punksRemainingToAssign -= numberPunksReservedThisRun;
        numberOfPunksReserved += numberPunksReservedThisRun;
        balanceOf[msg.sender] += numberPunksReservedThisRun;
    }

    function getPunk(uint punkIndex) {
        if (punksRemainingToAssign == 0) throw;
        if (punkIndexToAddress[punkIndex] != 0x0) throw;
        punkIndexToAddress[punkIndex] = msg.sender;
        balanceOf[msg.sender]++;
        punksRemainingToAssign--;
        Assign(msg.sender, punkIndex);
    }

    // Transfer ownership of a punk to another user without requiring payment
    function transferPunk(address to, uint punkIndex) {
        if (punkIndexToAddress[punkIndex] != msg.sender) throw;
        punkIndexToAddress[punkIndex] = to;
        balanceOf[msg.sender]--;
        balanceOf[to]++;
        Transfer(msg.sender, to, 1);
        PunkTransfer(msg.sender, to, punkIndex);
    }

    function punkNoLongerForSale(uint punkIndex) {
        if (punkIndexToAddress[punkIndex] != msg.sender) throw;
        punksOfferedForSale[punkIndex] = Offer(false, punkIndex, msg.sender, 0, 0x0);
        PunkNoLongerForSale(punkIndex);
    }

    function offerPunkForSale(uint punkIndex, uint minSalePriceInWei) {
        if (punkIndexToAddress[punkIndex] != msg.sender) throw;
        punksOfferedForSale[punkIndex] = Offer(true, punkIndex, msg.sender, minSalePriceInWei, 0x0);
        PunkOffered(punkIndex, minSalePriceInWei, 0x0);
    }

    function offerPunkForSaleToAddress(uint punkIndex, uint minSalePriceInWei, address toAddress) {
        if (punkIndexToAddress[punkIndex] != msg.sender) throw;
        punksOfferedForSale[punkIndex] = Offer(true, punkIndex, msg.sender, minSalePriceInWei, toAddress);
        PunkOffered(punkIndex, minSalePriceInWei, toAddress);
    }

    function buyPunk(uint punkIndex) payable {
        Offer offer = punksOfferedForSale[punkIndex];
        if (!offer.isForSale) throw;                // punk not actually for sale
        if (offer.onlySellTo != 0x0 && offer.onlySellTo != msg.sender) throw;  // punk not supposed to be sold to this user
        if (msg.value < offer.minValue) throw;      // Didn't send enough ETH
        if (offer.seller != punkIndexToAddress[punkIndex]) throw; // Seller no longer owner of punk

        punkIndexToAddress[punkIndex] = msg.sender;
        balanceOf[offer.seller]--;
        balanceOf[msg.sender]++;
        Transfer(offer.seller, msg.sender, 1);

        punkNoLongerForSale(punkIndex);
        pendingWithdrawals[offer.seller] += msg.value;
        PunkBought(punkIndex, msg.value, offer.seller, msg.sender);
    }

    function withdraw() {
        uint amount = pendingWithdrawals[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}
```

Lets see what happens if a use decides to buy a Cryptopunk:

He sends a transaction request for the payable function `buyPunk(index)` in line 111, where `index` indicates which Punk he wants to buy, together with the required amount of Ether.

The contract first instantiates `offer`, which is the following struct, as declared above in line 27 as: `offer = punksOfferedForSale[punkIndex]`:

```javascript
    struct Offer {
        bool isForSale;
        uint punkIndex;
        address seller;
        uint minValue;          // in ether
        address onlySellTo;     // specify to sell only to a specific person
    }
```

So `offer` carries the field `seller` which is the address of the seller of the contract, which will become relevant soon!

Now, in line 133-116 we check that:

1. The Punk is for sale

2. If the Punk is only available to one specific account, this account address should equeal to the senders account address

3. If the amount of Ether that the sender sent is to low, we cancel

4. We cancel if the Seller no longer owns the Punk

Now beginning with line 118, all validity checks have passed and from now on, the contract does all the accounting to transfer balances and ownerships for the purchase:

Line 118 assigns the ownership of the punk to the sender of the message

Line 119 and line 120 increase and decrease the amount of punks which are held by buyer and seller.

Line 120 emits the `Transfer` event signalizing the transfer of a Punk to the Ethereum Blockchain.

Line 122 deserves some attention: it executes the function `punkNoLongerForSale(punkIndex)`:

```javascript
    function punkNoLongerForSale(uint punkIndex) {
        if (punkIndexToAddress[punkIndex] != msg.sender) throw;
        punksOfferedForSale[punkIndex] = Offer(false, punkIndex, msg.sender, 0, 0x0);
        PunkNoLongerForSale(punkIndex);
    }
```

It first checks that the sender indeed acquired the Punk.

Then it updates the `punksOfferedForSale` array by its new values, which seem to be legit: the position belonging to the acquired Punk with index `punkIndex` gets reassigned with the new `Offfer`: the punk is now no longer for sale, it obtains now the address of the sender `msg.sender` as its owner, and since it is no longer for sale, the `minValue` can be set to zero.

Now in line 123, we request a new withdrawal for `offer.seller`, for the amount which has been send by `msg.seller`.

Finally the contract triggers the `PunkBought` event since the buyal process is complete.

So lets find the bug: Actually, things go wrong in line 123. We request a withdrawal here for `offer.seller`. And actually `offer.seller` is the `seller` field of `offer` and offer is a reference to `punksOfferedForSale[punkIndex]`, just look at line 111 above! But we reassigned `punksOfferedForSale[punkIndex]` in `punkNoLongerForSale` with the value: `punksOfferedForSale[punkIndex] = Offer(false, punkIndex, msg.sender, 0, 0x0)`, hence `offer.sender` had already been overwritten by the address `msg.sender`, so finally the Contract authorizes a withdrawal to the senders (=buyers) address instead to the sellers address!

The underlying reason why this happened, is that by design Solidity is a [pass-by-reference](https://www.cs.fsu.edu/~myers/c++/notes/references.html) language. It doesn't assign values, but references to values.
