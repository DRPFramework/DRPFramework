import * as alt from 'alt-server';

export class VectorUtil {
  public static distance(vector1: alt.Vector3, vector2: alt.Vector3): number {
    if (vector1 === undefined || vector2 === undefined) {
      throw new Error('Vector1 ya da Vector2 bilgisi boş olamaz!');
    }

    return Math.sqrt(
      Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
    );
  }
}
