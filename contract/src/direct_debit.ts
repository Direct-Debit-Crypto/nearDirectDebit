
import { NearBindgen, initialize, near, call, view, UnorderedMap, assert, Vector, validateAccountId, NearPromise } from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types'

class Assertions {
    static hasAtLeastOneAttachedYocto() {
      assert(
        near.attachedDeposit() > BigInt(0),
        "Requires at least 1 yoctoNEAR to ensure signature"
      );
    }
  
    static isLeftGreaterThanRight(
      left: string | bigint | number | boolean,
      right: string | bigint | number | boolean,
      message: string = null
    ) {
      const msg =
        message || `Provided amount ${left} should be greater than ${right}`;
      assert(BigInt(left) > BigInt(right), msg);
    }
  }


@NearBindgen({})
class DirectDebit {
    maxNumberVendor: number;
    payLater: boolean;
    owner: string;
    treasure: bigint;
    vendorsMaxLimit:  UnorderedMap<bigint>;
    vendorsInvoicesUsedLimit:   UnorderedMap<bigint>;
    vendorsList:  Vector<String>;
    
    // All the fees associated must be paid by the depositor by the person that has created this contract 
    // Meaning all storage cost associated


    // vvvvvvvvvvvvvvvv HELPER FUNCTIONS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    internalSendNEAR(receivingAccountId: string, amount: bigint) {
        Assertions.isLeftGreaterThanRight(amount, 0);
        Assertions.isLeftGreaterThanRight(
          near.accountBalance(),
          amount,
          `Not enough balance ${near.accountBalance()} to send ${amount}`
        );
        const promise = near.promiseBatchCreate(receivingAccountId);
        near.promiseBatchActionTransfer(promise, amount);
        // near.promiseReturn(promise);
      }
    // ^^^^^^^^^^^^^^^^ HELPER FUNCTIONS ^^^^^^^^^^^^^^^^^^^^






    // vvvvvvvvvvvvvvvv CONSTRUCTOR vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    constructor()
    {
        this.maxNumberVendor = 5;
        this.payLater = false;
        this.treasure = BigInt(0);
        this.owner = "";
        this.vendorsMaxLimit= new UnorderedMap<bigint>("vendorsMaxLimit");
        this.vendorsInvoicesUsedLimit = new UnorderedMap<bigint>("vendorsInvoicesUsedLimit");
        this.vendorsList = new Vector<String>("");
    }
    // ^^^^^^^^^^^^^^^^ CONSTRUCTOR ^^^^^^^^^^^^^^^^^^^^

    @initialize({})
    init({ maxNumberVendor, payLater }: { maxNumberVendor: number; payLater: boolean }) {
      Assertions.isLeftGreaterThanRight(maxNumberVendor, 0);

      this.maxNumberVendor = maxNumberVendor;
      this.payLater = payLater;
      this.owner = near.predecessorAccountId();
    }



    // vvvvvvvvvvvvvvvv  CALL METHODS PAYABLE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    @call({ payableFunction: true })
    deposit_treasure(): void {
      near.log(`deposit_amount called `);
      //Anyone can deposit no restriction in place
      this.treasure = this.treasure + near.attachedDeposit();
    }


    @call({ payableFunction: true }) // This method changes the state, for which it cost gas
    pay_vendor({ vendorAddress }: { vendorAddress: string }): void {
        assert(near.predecessorAccountId() == this.owner, "Only owner can pay vendor");
        assert(this.payLater == true, "this function is available only for pay later enabled")
        assert(this.vendorsMaxLimit.get(vendorAddress, {defaultValue: BigInt(0)}) <= BigInt(0), "Not a vendor address.");
        assert(this.vendorsInvoicesUsedLimit.get(vendorAddress, {defaultValue: BigInt(0)}) <= BigInt(0), "No outstanding balance for vendor.");
        near.log(`pay_vendor called ${vendorAddress}`);
        validateAccountId(vendorAddress);
        near.log(`pay_vendor will pay ${this.vendorsInvoicesUsedLimit.get(vendorAddress, {defaultValue: BigInt(0)})}`);
        this.internalSendNEAR(vendorAddress, this.vendorsInvoicesUsedLimit.get(vendorAddress, {defaultValue: BigInt(0)}));
        this.treasure = this.treasure - BigInt(this.vendorsInvoicesUsedLimit.get(vendorAddress, {defaultValue: BigInt(0)}));
        this.vendorsInvoicesUsedLimit.set(vendorAddress, BigInt(0));
    }

    @call({ payableFunction: true }) // This method changes the state, for which it cost gas
    pay_all_vendors(): void {
        assert(near.predecessorAccountId() == this.owner, "Only owner can pay all vendor");
        assert(this.payLater == true, "this function is available only for pay later enabled")
        near.log(`pay_all_vendors called.`);
        var i = 0;
        var address_vector;

        for(i = 0; i <  this.vendorsList.length; i++)
        {
          address_vector = this.vendorsList.get(i, {defaultValue:""})

          if(this.vendorsInvoicesUsedLimit.get(address_vector, {defaultValue: BigInt(0)}) > BigInt(0))
          {
            near.log(`the amount ${this.vendorsInvoicesUsedLimit.get(address_vector, {defaultValue: BigInt(0)})} will be paid to ${address_vector}`);
            this.internalSendNEAR(address_vector, this.vendorsInvoicesUsedLimit.get(address_vector, {defaultValue: BigInt(0)}))
            this.vendorsInvoicesUsedLimit.set(address_vector, BigInt(0));
            this.treasure = this.treasure - BigInt(this.vendorsInvoicesUsedLimit.get(address_vector, {defaultValue: BigInt(0)}));
          }
          else
          {
            near.log(`the amount will be paid to ${address_vector} as used limit is not bigger than 0`);
          }
        }
    }

    @call({ payableFunction: true })
    withdraw_treasure({amount} : {amount : bigint}): void {
        assert(near.predecessorAccountId() == this.owner, "Only owner can add a new vendor");
        near.log(`withdraw_treasure called  ${amount}`);
        this.internalSendNEAR(this.owner, amount); //withdraw to owner only
        this.treasure = this.treasure - BigInt(amount);
    }

    // ^^^^^^^^^^^^^^^^  CALL METHODS PAYABLE ^^^^^^^^^^^^^^^^^^^^




    // vvvvvvvvvvvvvvvv CALL METHODS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    @call({}) // This method changes the state, for which it cost gas
    set_invoice({ amount_in }: { amount_in : bigint }): void {
        assert(amount_in > BigInt(0), "Amount should be greater than 0");
        const vendorAddress = near.predecessorAccountId()
        // validateAccountId(vendorAddress);
        var address_vector;
        var i = 0;
        var whitelisted_poz = -1;
        near.log(`address ${vendorAddress} whats to set an invoice.`);
        for(i = 0; i <  this.vendorsList.length; i++)
        {
          address_vector = this.vendorsList.get(i, {defaultValue:""})
          if (address_vector == vendorAddress)
          {
            whitelisted_poz = i;
            break;
          }
        }
        assert(whitelisted_poz >= 0, "Address not in vendor whitelist.");
        
        near.log(`address ${vendorAddress}at pozition ${whitelisted_poz}.`);
        
        const amount_used_so_far = this.vendorsInvoicesUsedLimit.get(vendorAddress, {defaultValue: BigInt(0)});
        const new_amount_used = amount_used_so_far + amount_in;
        assert(new_amount_used <= this.vendorsMaxLimit.get(vendorAddress, {defaultValue: BigInt(0)}) ,"You have reach your limit");
        this.vendorsInvoicesUsedLimit.set(vendorAddress, new_amount_used)

        if(this.payLater == false)
        {
            near.log(`address ${vendorAddress} will be paid ${amount_in}.`);
            this.internalSendNEAR(vendorAddress, amount_in)
            this.treasure = this.treasure - BigInt(amount_in);
            near.log(`vendor ${vendorAddress} paid ${amount_in}.`);
        }


    }


    @call({}) // This method changes the state, for which it cost gas
    add_vendor({ vendorAddress, limitAmount }: { vendorAddress: string, limitAmount : bigint }): void {
      assert(near.predecessorAccountId() == this.owner, "Only owner can add a new vendor");
      assert(limitAmount > BigInt(0), "Amount should be greater than 0");
      
      near.log(`add_vendor called ${vendorAddress}`);
      validateAccountId(vendorAddress);
        
      this.vendorsList.push(vendorAddress);
      this.vendorsMaxLimit.set(vendorAddress, limitAmount)
      near.log(`add_vendor added ${vendorAddress} with limit ${limitAmount}`);
    }

    @call({}) // This method changes the state, for which it cost gas
    remove_vendor({ vendorAddress }: { vendorAddress: string }): void {
        assert(near.predecessorAccountId() == this.owner, "Only owner can remove a vendor");
        assert(this.vendorsMaxLimit.get(vendorAddress, {defaultValue: BigInt(0)}) <= BigInt(0), "Not a vendor address.");
        assert(this.vendorsInvoicesUsedLimit.get(vendorAddress, {defaultValue: BigInt(0)}) <= BigInt(0), "Outstanding balance should be 0.");

        near.log(`remove_vendor called ${vendorAddress}`);
        var address_vector;
        var i = 0;
        
        for(i = 0; i <  this.vendorsList.length; i++)
        {
          address_vector = this.vendorsList.get(i, {defaultValue:""})
          if (address_vector == vendorAddress)
          {
            this.vendorsList.swapRemove(i); // The last element is replaced by this removed one the vector must not be order so no issues here
            break;
          }
        }
        this.vendorsMaxLimit.set(vendorAddress, BigInt(0))
    }

    // ^^^^^^^^^^^^^^^^ CALL METHODS ^^^^^^^^^^^^^^^^^^^^







    // vvvvvvvvvvvvvvvv VIEW METHODS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    @view({}) // get values for this contract
    get_maxNumberVendor(): number {
        return this.maxNumberVendor;
    }

    @view({}) // get values for this contract
    get_payLater(): boolean {
        return this.payLater;
    }

    @view({}) // get values for this contract
    get_owner(): string {
        return this.owner;
    }

    @view({}) // get values for this contract
    get_treasure(): bigint {
        return this.treasure;
    }

    @view({}) // get values for this contract
    get_vendorsList(): Vector<String> {
        return this.vendorsList;
    }

    @view({}) // get values for this contract
    get_vendor_amount_used({ vendorAddress } :{ vendorAddress: string}): bigint {
        
        if (vendorAddress != "")
        {
            return this.vendorsInvoicesUsedLimit.get(vendorAddress, {defaultValue: BigInt(0)})
        }
        else
        {
            return BigInt(0)
        }
    }

    @view({}) // get values for this contract
    get_vendor_max_amount({ vendorAddress } :{ vendorAddress: string}): bigint {
        
        if (vendorAddress != "")
        {
            return this.vendorsMaxLimit.get(vendorAddress, {defaultValue: BigInt(0)})
        }
        else
        {
            return BigInt(0)
        }
    }

    @view({}) // get values for this contract
    get_vendors_amount_used(): bigint {
        var i = 0;
        var address_vector;
        var all_vendors_amount_used = BigInt(0);

        for(i = 0; i <  this.vendorsList.length; i++)
        {
            address_vector = this.vendorsList.get(i, {defaultValue:""})
            if (address_vector == "")
            {
                all_vendors_amount_used = all_vendors_amount_used + this.vendorsInvoicesUsedLimit.get(address_vector, {defaultValue: BigInt(0)})
            }
        }
        
        return all_vendors_amount_used;
    }


    @view({}) // get values for this contract
    get_vendors_max_amount(): bigint {
        var i = 0;
        var address_vector;
        var all_vendors_amount_used = BigInt(0);

        for(i = 0; i <  this.vendorsList.length; i++)
        {
            address_vector = this.vendorsList.get(i, {defaultValue:""})
            if (address_vector == "")
            {
                all_vendors_amount_used = all_vendors_amount_used + this.vendorsMaxLimit.get(address_vector, {defaultValue: BigInt(0)})
            }
        }
        
        return all_vendors_amount_used;
    }

    // ^^^^^^^^^^^^^^^^^^^^ VIEW METHODS ^^^^^^^^^^^^^^^^^^^^

}