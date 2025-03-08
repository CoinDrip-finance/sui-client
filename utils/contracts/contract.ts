import { AbiRegistry, Address, Interaction, ResultsParser, SmartContract } from '@multiversx/sdk-core/out';

import { querySc } from '../../apis/queries';
import { chainId } from '../../config';

type AbiType = {
  types: Record<string, any>;
};
export default class Contract<T extends AbiType = any> {
  protected resultParser = new ResultsParser();
  address: Address;
  contract: SmartContract;
  abiRegistry: AbiRegistry;
  constructor(address: string, abi: T) {
    this.address = new Address(address);
    this.abiRegistry = AbiRegistry.create(abi as any);
    this.contract = new SmartContract({
      address: this.address,
      abi: this.abiRegistry,
    });
  }

  protected interceptInteraction(interaction: Interaction, gasLimit: number) {
    return interaction.withChainID(chainId!).withGasLimit(gasLimit);
  }

  protected async runQuery(interaction: Interaction) {
    const query = interaction.check().buildQuery();
    const queryResponse = await querySc(query);
    return this.resultParser.parseQueryResponse(queryResponse, interaction.getEndpoint());
  }

  //   protected getAbiType(typeName: string) {
  //     const type = this.abiRegistry.customTypes.find((t) => t.getName() === typeName);
  //     if (!type) throw new Error("invalid custom type");
  //     return type;
  //   }

  //   parseCustomType<U = any>(data: string, typeName: keyof T["types"]): U {
  //     const arg = new ArgSerializer();
  //     const type = this.getAbiType(typeName as string);
  //     return arg
  //       .buffersToValues([Buffer.from(data, "base64")], [new EndpointParameterDefinition("foo", "bar", type)])[0]
  //       ?.valueOf();
  //   }
}
