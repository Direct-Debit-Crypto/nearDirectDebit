
import { NearBindgen, near, call, view, UnorderedMap, Vector } from 'near-sdk-js';

@NearBindgen({})
class DirectDebit {
    maxNumberVendor: number;
    payLater: boolean;
    owner: string;
    treasure: bigint;
    vendorsMaxLimit:  UnorderedMap<bigint>;
    vendorsInvoicesUsedLimit:   UnorderedMap<bigint>;
    vendorsList:  Vector<String>;


    // vvvvvvvvvvvvvvvv CONSTRUCTOR vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    constructor({ payLaterIN, maxNumberVendorIN }: { payLaterIN: boolean, maxNumberVendorIN: number })
    {
        this.maxNumberVendor = maxNumberVendorIN;
        this.payLater = payLaterIN;
        this.owner = near.predecessorAccountId();
        this.vendorsMaxLimit= new UnorderedMap<bigint>("vendorsMaxLimit")
        this.vendorsInvoicesUsedLimit = new UnorderedMap<bigint>("vendorsInvoicesUsedLimit")
    }
    // ^^^^^^^^^^^^^^^^ CONSTRUCTOR ^^^^^^^^^^^^^^^^^^^^





    // vvvvvvvvvvvvvvvv CONSTRUCTOR vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    @call({}) // This method changes the state, for which it cost gas
    add_vendor({ vendorAddress }: { vendorAddress: string }): void {
      near.log(`add_vendor called ${vendorAddress}`);
        
      this.vendorsList.push(vendorAddress);
    }

    @call({}) // This method changes the state, for which it cost gas
    remove_vendor({ vendorAddress }: { vendorAddress: string }): void {
        near.log(`remove_vendor called ${vendorAddress}`);
        var address_vector;
        var i = 0;
        
        for(i = 0; i <  this.vendorsList.length; i++)
        {
          address_vector = this.vendorsList.get(i, {defaultValue:""})
          if (address_vector == vendorAddress)
          {
            this.vendorsList.swapRemove(i); // The last element is replaced by this removed one the vector must not be order so no issues here
          }
        }
    }

    @call({ payableFunction: true }) // This method changes the state, for which it cost gas
    pay_vendor({ vendorAddress }: { vendorAddress: string }): void {
      near.log(`pay_vendor called ${vendorAddress}`);
        
      this.vendorsList.push(vendorAddress);
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