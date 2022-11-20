


import { NearBindgen, near, call, view, UnorderedMap, Vector } from 'near-sdk-js';

@NearBindgen({})
class ListDebit {
    maxNumberVendor: number = 0;
    payLater: boolean = false;
    owner: string = "";
    treasure: bigint;
    vendorsMaxLimit:  UnorderedMap<number> = new UnorderedMap<number>("vendorsMaxLimit");
    vendorsInvoicesUsedLimit:   UnorderedMap<number> = new UnorderedMap<number>("vendorsInvoicesUsedLimit");
    vendorsList:  Vector<String>;


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
  get_greeting(): string {
    return this.message;
  }

  @call({}) // This method changes the state, for which it cost gas
  set_greeting({ message }: { message: string }): void {
    near.log(`Saving greeting ${message}`);
    this.message = message;
  }
}