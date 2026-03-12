import Replicate from "replicate";

let client: Replicate | null = null;

function getClient(): Replicate {
  if (!client) {
    client = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
  }
  return client;
}

export async function performVirtualTryOn(
  garmUrl: string,
  humanUrl: string
): Promise<unknown> {
  const replicate = getClient();
  const output = await replicate.run(
    "yisol/idm-vton:c871bb9b046607b680449ecbae55fd8c972f0967389c9c381c828ca1ebfb696b",
    {
      input: {
        crop: false,
        seed: 42,
        steps: 30,
        category: "upper_body",
        force_dc: false,
        garm_img: garmUrl,
        human_img: humanUrl,
        mask_only: false,
        garment_des: "t-shirt",
      },
    }
  );
  return output;
}
